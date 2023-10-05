from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Note
from .serializers import NoteSerializer
# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/notes',
            'method': 'GET',
            'body': 'None',
            'description': 'Returns an array of notes'
        },
         {
            'Endpoint': '/notes/id',
            'method': 'GET',
            'body': 'None',
            'description': 'Returns a single note'
        },
         {
            'Endpoint': '/notes/create',
            'method': 'POST',
            'body': {'body':""},
            'description': 'Create a new note'
        },
         {
            'Endpoint': '/notes/id/update',
            'method': 'PUT',
             'body': {'body':""},
            'description': 'Creates an existing note'
        },
         {
            'Endpoint': '/notes/id/delete',
            'method': 'DELETE',
            'body': 'None',
            'description': 'Deletes an existing note'
        }
    ]
    return Response(routes)

@api_view(['GET'])
def getNotes(request):
    notes = Note.objects.all()
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getNote(request,pk):
    notes = Note.objects.get(id=pk)
    serializer = NoteSerializer(notes, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
def updateNote(request,pk):
    data = request.data
    note = Note.objects.get(id=pk)
    serializer = NoteSerializer(instance=note, data=data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteNote(request,pk):
    note = Note.objects.get(id=pk)
    note.delete()
    return Response('note deleted')

@api_view(['POST'])
def createNote(request):
    data = request.data
    note = Note.objects.create(body=data['body'])
    serializer = NoteSerializer(instance=note, many=False)
    return Response(serializer.data)