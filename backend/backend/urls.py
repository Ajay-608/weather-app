"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def homepage(request):
    return JsonResponse({
        "message": "WeatherAI API - Built by Ajay Dammalapati",
        "version": "1.0",
        "project": "PM Accelerator AI Engineer Assessment",
        "status": "running",
        "endpoints": {
            "current_weather": "/api/weather/current/?location=London",
            "forecast": "/api/weather/forecast/?location=London",
            "searches": "/api/weather/searches/",
            "export_json": "/api/weather/searches/export_json/",
            "export_csv": "/api/weather/searches/export_csv/",
            "export_xml": "/api/weather/searches/export_xml/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', homepage, name='homepage'),
    path('admin/', admin.site.urls),
    path('api/weather/', include('weather.urls')),
]