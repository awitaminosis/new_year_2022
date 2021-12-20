import json
import redis

cache = redis.Redis(host='redis', port=6379, charset="utf-8", decode_responses=True)
cache.flushdb()  # cleanup at start

async def cache_set(cache_id, content):
    """seter"""
    cache.set(cache_id, json.dumps(content))

async def cache_get(cache_id):
    """getter"""
    s = cache.get(cache_id)
    if s == '' or s is None:
        return None
    else:
        return json.loads(s)

async def cache_get_clean(cache_id):
    """'remover' from cache"""
    s = await cache_get(cache_id)
    await cache_set(cache_id, list())
    return s
