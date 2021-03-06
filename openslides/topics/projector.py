from typing import Generator, Type

from ..core.exceptions import ProjectorException
from ..utils.projector import ProjectorElement
from .models import Topic


class TopicSlide(ProjectorElement):
    """
    Slide definitions for topic model.
    """
    name = 'topics/topic'

    def check_data(self):
        if not Topic.objects.filter(pk=self.config_entry.get('id')).exists():
            raise ProjectorException('Topic does not exist.')

    def update_data(self):
        data = None
        try:
            topic = Topic.objects.get(pk=self.config_entry.get('id'))
        except Topic.DoesNotExist:
            # Topic does not exist, so just do nothing.
            pass
        else:
            data = {'agenda_item_id': topic.agenda_item_id}
        return data


def get_projector_elements() -> Generator[Type[ProjectorElement], None, None]:
    yield TopicSlide
