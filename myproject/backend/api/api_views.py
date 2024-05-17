from rest_framework.views import APIView
from rest_framework.response import Response
from .models import HotModel, CategoryModel
from .serializers import HotSerializer, CategorySerializer

class HotFoodList(APIView):
    def get(self, request):
        hots = HotModel.objects.all()
        serializer = HotSerializer(hots, many=True)
        return Response(serializer.data)

class CategoryList(APIView):
    def get(self, request):
        categories = CategoryModel.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
