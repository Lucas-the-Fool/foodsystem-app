from rest_framework import serializers
from .models import FoodModel, CategoryModel, HotModel

class FoodSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model = FoodModel
        fields = ['id', 'name', 'image', 'content', 'view_count', 'category']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryModel
        fields = ['id', 'name']

class HotSerializer(serializers.ModelSerializer):
    food = FoodSerializer()

    class Meta:
        model = HotModel
        fields = ['food']
