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
        }
    })

urlpatterns = [
    path('', homepage),
    path('admin/', admin.site.urls),
    path('api/weather/', include('weather.urls')),
]