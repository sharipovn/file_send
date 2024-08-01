
from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.list_users, name='list-users'),
    path('file_upload/', views.file_upload, name='file_upload'),
    path('create_group/', views.create_group, name='create_group'),
    path('all_files/',views.all_files,name='all_files'),
    path('my_groups/',views.my_groups,name='my_groups'),
    path('my_files/',views.my_files,name='my_files'),
    path('login/',views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('password_change/', views.password_change, name='password_change'),
    path('user_profile/', views.user_profile, name='user_profile'),
    path('update_profile/', views.update_user_profile, name='update_profile'),
    path('delete_file/<uuid:file_id>/', views.delete_file, name='delete_file'),
]
