from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'searches', views.WeatherSearchViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('current/', views.get_current_weather, name='current-weather'),
    path('forecast/', views.get_forecast, name='weather-forecast'),
]