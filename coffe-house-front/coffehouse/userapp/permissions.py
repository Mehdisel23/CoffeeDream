from rest_framework import permissions


class IsAdminPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (request.user and
                request.user.is_admin and
                request.user.is_authenticated)


class IsSellerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return (request.user and
                request.user.is_authenticated and
                request.user.is_seller)

    def has_object_permission(self, request, view, obj):
        return (request.user and
                request.user.is_authenticated and
                request.user.is_seller)

class IsClientPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (request.user and
                request.user.is_client and
                request.user.is_authenticated
                )
