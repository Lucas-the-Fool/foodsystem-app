from django.urls import path
from . import api_views
from .views import login, register ,food_list_api, food_detail_api,food_check,add_comment,add_like,input_score,my_like

urlpatterns = [
    path('hotfoods/', api_views.HotFoodList.as_view(), name='hot-foods'),
    path('categories/', api_views.CategoryList.as_view(), name='categories'),
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('foods/<int:category_id>/', food_list_api, name='food-list-api'),
    path('foods/detail/<int:food_id>/', food_detail_api, name='food-detail-api'),
    path('food_check', food_check, name='food_check'),
    path('add_comment/', add_comment, name='add_comment'),
    path('add_like/', add_like, name='add_like'),
    path( 'input_score/',input_score,name='input_score'),
    path( 'my_like/',my_like,name='my_like')

]
