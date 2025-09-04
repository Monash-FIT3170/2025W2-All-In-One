FROM zodern/meteor
# bundle created by: meteor build --directory ./bundle --server-only
COPY --chown=app:app bundle/bundle /built_app
RUN cd /built_app/programs/server && npm install