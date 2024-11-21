

class ResponseCode(object):
    SUCCESS = 200  # 成功
    PENDING = 202
    STARTED = 201
    FAIL = -1  # 失败
    NO_RESOURCE_FOUND = 40001  # 未找到资源
    INVALID_PARAMETER = 40002  # 参数无效
    
class ResponseMessage(object):
    SUCCESS = "success"
    FAIL =  "fail"
    PENDING = 'pending'
    STARTED = 'started'
    NO_RESOURCE_FOUND =  "no resource found"
    INVALID_PARAMETER =  "invalid parameter"
