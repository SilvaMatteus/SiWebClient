""" This module contains the code or patterns shared by
one or more classes.
"""

class SingletonType(type):
    """It's simply a type that has only one instance.
    """
    def __call__(cls, *args, **kwargs):
        """Calls the class.
        """
        try:
            return cls.__instance
        except AttributeError:
            cls.__instance = super(
                SingletonType, cls).__call__(*args, **kwargs)
        return cls.__instance

def default_parser(obj):
    if getattr(obj, "__dict__", None):
        return obj.__dict__
    elif type(obj) == datetime:
        return obj.isoformat()
    else:
        return str(obj)
