from typing import Optional


from beyond_the_loop.models.users import Users
from beyond_the_loop.models.groups import (
    Groups,
    GroupForm,
    GroupUpdateForm,
    GroupResponse,
)

from open_webui.constants import ERROR_MESSAGES
from fastapi import APIRouter, Depends, HTTPException, status
from open_webui.utils.auth import get_admin_user, get_verified_user

router = APIRouter()

############################
# GetFunctions
############################


@router.get("/", response_model=list[GroupResponse])
async def get_groups(user=Depends(get_verified_user)):
    if user.role == "admin":
        return Groups.get_groups_by_company(user.company_id)
    else:
        return Groups.get_groups_by_member_id(user.id)


############################
# CreateNewGroup
############################


@router.post("/create", response_model=Optional[GroupResponse])
async def create_new_function(form_data: GroupForm, user=Depends(get_admin_user)):
    try:
        group = Groups.insert_new_group(user.company_id, form_data)
        if group:
            return group
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error creating group"),
            )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# GetGroupById
############################


@router.get("/id/{id}", response_model=Optional[GroupResponse])
async def get_group_by_id(id: str, user=Depends(get_admin_user)):
    group = Groups.get_group_by_id(id)
    if group:
        return group
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ERROR_MESSAGES.NOT_FOUND,
        )


############################
# UpdateGroupById
############################


@router.post("/id/{id}/update", response_model=Optional[GroupResponse])
async def update_group_by_id(
    id: str, form_data: GroupUpdateForm, user=Depends(get_admin_user)
):
    try:
        if form_data.user_ids:
            form_data.user_ids = Users.get_valid_user_ids(form_data.user_ids)

        group = Groups.update_group_by_id(id, form_data)
        if group:
            return group
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error updating group"),
            )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# DeleteGroupById
############################


@router.delete("/id/{id}/delete", response_model=bool)
async def delete_group_by_id(id: str, user=Depends(get_admin_user)):
    try:
        result = Groups.delete_group_by_id(id)
        if result:
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error deleting group"),
            )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )
