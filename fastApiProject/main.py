from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
#CORS or "Cross-Origin Resource Sharing" refers to the situations
# when a frontend running in a browser has JavaScript code that communicates
# with a backend, and the backend is in a different "origin" than the frontend.
# https://fastapi.tiangolo.com/tutorial/cors/?h=cors

from BirbBerry.routers import posts_router, users_router

app = FastAPI(docs_url="/", title="BirbBerry", version="0.0.1")

origins = ["*"]
methods = ["*"]
headers = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # A list of origins that should be permitted to make cross-origin requests. E.g. ['https://example.org', 'https://www.example.org']
    allow_credentials=True, # Indicate that cookies should be supported for cross-origin requests.
    allow_methods=methods, #  A list of HTTP methods that should be allowed for cross-origin requests. Defaults to ['GET']. You can use ['*'] to allow all standard methods.
    allow_headers=headers, # A list of HTTP request headers that should be supported for cross-origin requests.
    max_age=3600, # Sets a maximum time in seconds for browsers to cache CORS responses. Defaults to 600.
)

app.include_router(posts_router.router)
app.include_router(users_router.router)
