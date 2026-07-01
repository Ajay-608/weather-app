import requests
import csv
import json
import xml.etree.ElementTree as ET
from django.conf import settings
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import WeatherSearch
from .serializers import WeatherSearchSerializer
from datetime import datetime


@api_view(['GET'])
def get_current_weather(request):
    location = request.GET.get('location', '')
    lat = request.GET.get('lat', '')
    lon = request.GET.get('lon', '')

    try:
        if lat and lon:
            params = {'lat': lat, 'lon': lon, 'appid': settings.WEATHER_API_KEY, 'units': 'metric'}
        else:
            params = {'q': location, 'appid': settings.WEATHER_API_KEY, 'units': 'metric'}

        url = f"{settings.WEATHER_BASE_URL}/weather"
        response = requests.get(url, params=params, timeout=10)

        if response.status_code == 404:
            return Response({'error': 'Location not found. Please check the name and try again.'}, status=status.HTTP_404_NOT_FOUND)
        if response.status_code == 401:
            return Response({'error': 'Invalid API key.'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(response.json())

    except requests.exceptions.Timeout:
        return Response({'error': 'Request timed out. Please try again.'}, status=status.HTTP_408_REQUEST_TIMEOUT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_forecast(request):
    location = request.GET.get('location', '')
    lat = request.GET.get('lat', '')
    lon = request.GET.get('lon', '')

    try:
        if lat and lon:
            params = {'lat': lat, 'lon': lon, 'appid': settings.WEATHER_API_KEY, 'units': 'metric'}
        else:
            params = {'q': location, 'appid': settings.WEATHER_API_KEY, 'units': 'metric'}

        url = f"{settings.WEATHER_BASE_URL}/forecast"
        response = requests.get(url, params=params, timeout=10)

        if response.status_code == 404:
            return Response({'error': 'Location not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(response.json())

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WeatherSearchViewSet(viewsets.ModelViewSet):
    queryset = WeatherSearch.objects.all()
    serializer_class = WeatherSearchSerializer

    def create(self, request):
        date_from = request.data.get('date_from')
        date_to = request.data.get('date_to')

        if date_from and date_to:
            try:
                d_from = datetime.strptime(date_from, '%Y-%m-%d')
                d_to = datetime.strptime(date_to, '%Y-%m-%d')
                if d_from > d_to:
                    return Response({'error': 'Start date cannot be after end date.'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = WeatherSearchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def export_json(self, request):
        searches = WeatherSearch.objects.all()
        serializer = WeatherSearchSerializer(searches, many=True)
        response = HttpResponse(
            json.dumps(serializer.data, indent=2, default=str),
            content_type='application/json'
        )
        response['Content-Disposition'] = 'attachment; filename="weather_history.json"'
        return response

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="weather_history.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Location', 'Country', 'Temperature', 'Feels Like', 'Humidity', 'Wind Speed', 'Description', 'Searched At', 'Notes'])
        for s in WeatherSearch.objects.all():
            writer.writerow([s.id, s.location, s.country, s.temperature, s.feels_like, s.humidity, s.wind_speed, s.description, s.searched_at.strftime('%Y-%m-%d %H:%M:%S'), s.notes])
        return response

    @action(detail=False, methods=['get'])
    def export_xml(self, request):
        root = ET.Element('WeatherHistory')
        for s in WeatherSearch.objects.all():
            item = ET.SubElement(root, 'WeatherSearch')
            ET.SubElement(item, 'ID').text = str(s.id)
            ET.SubElement(item, 'Location').text = s.location
            ET.SubElement(item, 'Country').text = s.country
            ET.SubElement(item, 'Temperature').text = str(s.temperature)
            ET.SubElement(item, 'Humidity').text = str(s.humidity)
            ET.SubElement(item, 'WindSpeed').text = str(s.wind_speed)
            ET.SubElement(item, 'Description').text = s.description
            ET.SubElement(item, 'SearchedAt').text = str(s.searched_at)
        xml_str = ET.tostring(root, encoding='unicode')
        response = HttpResponse(xml_str, content_type='application/xml')
        response['Content-Disposition'] = 'attachment; filename="weather_history.xml"'
        return response