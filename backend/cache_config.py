from flask_caching import Cache

cache = Cache()

def init_cache(app):
    app.config["CACHE_TYPE"] = "SimpleCache"
    app.config["CACHE_DEFAULT_TIMEOUT"] = 300
    cache.init_app(app)