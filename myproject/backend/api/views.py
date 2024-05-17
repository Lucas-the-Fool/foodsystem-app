from django.shortcuts import render, redirect
from .models import MarkModel, CommentModel, HotModel, LikeModel, FoodModel, CategoryModel, UserInfoModel
from django.http import JsonResponse,Http404
import numpy as np
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.hashers import check_password
from backend.utils.image_check import check_handle
import os
from django.conf import settings
import time
from django.core.serializers import serialize

def home(request):
    return JsonResponse({'message': 'Hello, world!'})



@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            password = data.get('password')
          
        except (json.JSONDecodeError, KeyError):
            return JsonResponse({'code': 400, 'message': '缺少必传的参数'})

        if not (username and password):
            return JsonResponse({'code': 400, 'message': '缺少必传的参数'})

        user = UserInfoModel.objects.filter(username=username, password=password).first()
        if not user:
            return JsonResponse({'code': 400, 'message': '账号或密码错误'})
        
        return JsonResponse({'code': 200, 'message': '登录成功', 'userId': user.id})
    else:
        return JsonResponse({'code': 405, 'message': '仅支持POST方法'}, status=405)

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            password1 = data.get('password1')
            password2 = data.get('password2')
            address = data.get('address')
            phone = data.get('phone')
            print(password1,phone)
        except (json.JSONDecodeError, KeyError):
            return JsonResponse({'code': 400, 'message': '缺少必传的参数'})

        if not (username and password1 and password2 and address and phone):
            return JsonResponse({'code': 400, 'message': '缺少必传的参数'})
        if password1 != password2:
            return JsonResponse({'code': 400, 'message': '两次输入的密码不一致！'})
        if UserInfoModel.objects.filter(username=username).exists():
            return JsonResponse({'code': 400, 'message': '该用户名已存在'})
        UserInfoModel.objects.create(
            username=username,
            password=password1,  # 注意在实际应用中，密码应该进行哈希处理
            address=address,
            phone=phone
        )
        return JsonResponse({'code': 201, 'message': '注册成功'})
    else:
        return JsonResponse({'code': 405, 'message': '仅支持POST方法'}, status=405)

def food_list_api(request, category_id):
    if request.method == 'GET':
        foods = FoodModel.objects.filter(category_id=category_id)
        food_list = []
        for food in foods:
            food_list.append({
                'id': food.id,
                'name': food.name,
                'image': food.image.url,
                'category': food.category.name,
            })
        return JsonResponse(food_list, safe=False)


@csrf_exempt
def my_like(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_id = data.get('user_id')
            print(user_id)
            likes = LikeModel.objects.filter(user_id=user_id)
            # Serialize QuerySet to JSON
            serialized_likes = serialize('json', likes)
            # Convert JSON string to list of dictionaries
            likes_data = [item['fields'] for item in json.loads(serialized_likes)]
            print(likes_data)
            return JsonResponse({'code': 200, 'likes': likes_data})
        except Exception as e:
            return JsonResponse({'code': 500, 'message': str(e)})
    else:
        return JsonResponse({'code': 405, 'message': 'Method Not Allowed'})


def food_detail_api(request, food_id):
    try:
        food = FoodModel.objects.get(id=food_id)
    except FoodModel.DoesNotExist:
        raise Http404("Food not found")

    comments = CommentModel.objects.filter(food_id=food_id)
    user_id = request.session.get('user_id')
    if user_id:
        flag_mask = MarkModel.objects.filter(item_id=food_id, user_id=user_id).first()
    else:
        flag_mask = False

    food.view_count += 1
    food.save()

    food_data = {
        'id': food.id,
        'name': food.name,
        'image': food.image.url,
        'content': food.content,
        'view_count': food.view_count,
        'category': food.category.name
    }

    comments_data = [
        {
            'id': comment.id,
            'user': comment.user.username,
            'content': comment.content,
            'create_time': comment.create_time,
        } for comment in comments
    ]

    data = {
        'food': food_data,
        'comments': comments_data,
        'flag_mask': flag_mask is not None
    }

    return JsonResponse(data)


@csrf_exempt
def food_check(request):
    if request.method == 'POST':
        if 'file' not in request.FILES:
            return JsonResponse({'code': 400, 'message': 'No file uploaded'})

        file = request.FILES['file']
        file_name = '{}.{}'.format(int(time.time()), file.name.split('.')[-1])
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        with open(file_path, 'wb') as f:
            for chunk in file.chunks():
                f.write(chunk)

        pred_name = check_handle(file_path)
        return JsonResponse({'code': 200, 'pred_name': pred_name})
    
    return JsonResponse({'code': 405, 'message': 'Only POST method is allowed'}, status=405)


@csrf_exempt
def add_comment(request):
    # 添加评论
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_id = data.get('user_id')
   
            print(user_id)

            if not user_id:
                return JsonResponse({'code': 400, 'message': '请先登录'})
        
            content = data.get('content')
            food_id = data.get('food_id')
            print(content,food_id)
            if not content:
                return JsonResponse({'code': 400, 'message': '内容不能为空'})

            CommentModel.objects.create(
                user_id=user_id,
                content=content,
                food_id=food_id
            )
            return JsonResponse({'code': 200})
        except Exception as e:
            return JsonResponse({'code': 500, 'message': str(e)})
    else:
        return JsonResponse({'code': 405, 'message': 'Method Not Allowed'})


@csrf_exempt
def add_like(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get('user_id')
        if not user_id:
            return JsonResponse({'code': 400, 'message': '请先登录'})
        
        try:
            food_id = data.get('food_id')
            print(user_id,food_id)
            flag = LikeModel.objects.filter(
                food_id=food_id,
                user_id=user_id
            ).first()

            if flag:
                return JsonResponse({'code': 400, 'message': '该食物已收藏'})

            LikeModel.objects.create(
                user_id=user_id,
                food_id=food_id
            )
            return JsonResponse({'code': 200})
        except Exception as e:
            return JsonResponse({'code': 500, 'message': str(e)})
    else:
        return JsonResponse({'code': 405, 'message': 'Method Not Allowed'})
    

@csrf_exempt
def input_score(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get('user_id')
        if not user_id:
            return JsonResponse({'code': 400, 'message': '请先登录'})
        
        score =  data.get('score')
        food_id =  data.get('food_id')
        MarkModel.objects.create(
            item_id=food_id,
            score=score,
            user_id=user_id
        )
    return JsonResponse({'code': 200})