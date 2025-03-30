from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = (
    [
        path("admin/", admin.site.urls),
        path("", TemplateView.as_view(template_name='index.html'))
    ]
    # https://docs.djangoproject.com/en/4.2/howto/static-files/#serving-static-files-during-development
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # https://docs.djangoproject.com/en/4.2/howto/static-files/#serving-files-uploaded-by-a-user-during-development
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
