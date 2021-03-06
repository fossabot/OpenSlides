from typing import Any, Dict, List

from asgiref.sync import sync_to_async
from django.db import DEFAULT_DB_ALIAS, connections
from django.test.utils import CaptureQueriesContext

from openslides.core.config import config
from openslides.users.models import User
from openslides.utils.autoupdate import Element, inform_changed_elements


class TConfig:
    """
    Cachable, that fills the cache with the default values of the config variables.
    """

    def get_collection_string(self) -> str:
        return config.get_collection_string()

    def get_elements(self) -> List[Dict[str, Any]]:
        elements = []
        config.key_to_id = {}
        for id, item in enumerate(config.config_variables.values()):
            elements.append({'id': id+1, 'key': item.name, 'value': item.default_value})
            config.key_to_id[item.name] = id+1
        return elements

    async def restrict_elements(
            self,
            user_id: int,
            elements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return elements


class TUser:
    """
    Cachable, that fills the cache with the default values of the config variables.
    """

    def get_collection_string(self) -> str:
        return User.get_collection_string()

    def get_elements(self) -> List[Dict[str, Any]]:
        return [
            {'id': 1, 'username': 'admin', 'title': '', 'first_name': '',
             'last_name': 'Administrator', 'structure_level': '', 'number': '', 'about_me': '',
             'groups_id': [4], 'is_present': False, 'is_committee': False, 'email': '',
             'last_email_send': None, 'comment': '', 'is_active': True, 'default_password': 'admin',
             'session_auth_hash': '362d4f2de1463293cb3aaba7727c967c35de43ee'}]

    async def restrict_elements(
            self,
            user_id: int,
            elements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return elements


async def set_config(key, value):
    """
    Set a config variable in the element_cache without hitting the database.
    """
    collection_string = config.get_collection_string()
    config_id = config.key_to_id[key]  # type: ignore
    full_data = {'id': config_id, 'key': key, 'value': value}
    await sync_to_async(inform_changed_elements)([
        Element(id=config_id, collection_string=collection_string, full_data=full_data)])


def count_queries(func, *args, **kwargs) -> int:
    context = CaptureQueriesContext(connections[DEFAULT_DB_ALIAS])
    with context:
        func(*args, **kwargs)

    print("%d queries executed\nCaptured queries were:\n%s" % (
        len(context),
        '\n'.join(
            '%d. %s' % (i, query['sql']) for i, query in enumerate(context.captured_queries, start=1))))
    return len(context)
