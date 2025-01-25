class NetworkEvent:
    def __init__(self):
        self.listeners = []

    def register(self, listener):
        self.listeners.append(listener)

    def notify(self, *args, **kwargs):
        for listener in self.listeners:
            listener(*args, **kwargs)