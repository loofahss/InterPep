from .utils import ResponseCode, ResponseMessage


class ResMsg(object):
    def __init__(self, data=None, code=ResponseCode.SUCCESS, 
    			 msg=ResponseMessage.SUCCESS):
        self._data = data
        self._msg = msg
        self._code = code

    def update(self, code=None, data=None, msg=None):
        if code is not None:
            self._code = code
        if data is not None:
            self._data = data
        if msg is not None:
            self._msg = msg

    def add_field(self, name=None, value=None):
        if name is not None and value is not None:
            self.__dict__[name] = value

    @property
    def data(self):
        body = self.__dict__
        body["data"] = body.pop("_data")
        body["msg"] = body.pop("_msg")
        body["code"] = body.pop("_code")
        return body
