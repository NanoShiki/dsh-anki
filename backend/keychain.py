"""Workspace-scoped generic password item in the user's macOS Keychain."""
import ctypes as c
import hashlib
import json


class KeychainState:
    service = b"org.nanoshiki.dsh-anki.sync"
    not_found = -25300

    def __init__(self, worker):
        self.account = hashlib.sha256(str(worker.root).encode()).hexdigest().encode()
        self.security = c.CDLL("/System/Library/Frameworks/Security.framework/Security")
        self.cf = c.CDLL("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation")
        ptr = c.c_void_p
        uint = c.c_uint32
        key = [ptr, uint, c.c_char_p, uint, c.c_char_p]
        for name, args in {
            "SecKeychainFindGenericPassword": key + [c.POINTER(uint), c.POINTER(ptr), c.POINTER(ptr)],
            "SecKeychainAddGenericPassword": key + [uint, ptr, c.POINTER(ptr)],
            "SecKeychainItemModifyAttributesAndData": [ptr, ptr, uint, ptr],
            "SecKeychainItemFreeContent": [ptr, ptr],
            "SecKeychainItemDelete": [ptr],
        }.items():
            function = getattr(self.security, name)
            function.argtypes = args
            function.restype = c.c_int32
        self.cf.CFRelease.argtypes = [ptr]
        self.cf.CFRelease.restype = None
        self.key = (None, len(self.service), self.service, len(self.account), self.account)

    @staticmethod
    def check(status):
        if status:
            raise RuntimeError(f"Keychain operation failed ({status})")

    def load(self):
        size, data = c.c_uint32(), c.c_void_p()
        status = self.security.SecKeychainFindGenericPassword(*self.key, c.byref(size), c.byref(data), None)
        if status == self.not_found:
            return None
        self.check(status)
        try:
            if size.value > 65536:
                raise ValueError("Invalid Keychain item size")
            return json.loads(c.string_at(data, size.value))
        finally:
            self.security.SecKeychainItemFreeContent(None, data)

    def save(self, state):
        payload = json.dumps(state, separators=(",", ":")).encode()
        item = c.c_void_p()
        status = self.security.SecKeychainFindGenericPassword(*self.key, None, None, c.byref(item))
        if status == self.not_found:
            self.check(self.security.SecKeychainAddGenericPassword(*self.key, len(payload), payload, None))
            return
        self.check(status)
        try:
            self.check(self.security.SecKeychainItemModifyAttributesAndData(item, None, len(payload), payload))
        finally:
            self.cf.CFRelease(item)

    def clear(self):
        item = c.c_void_p()
        status = self.security.SecKeychainFindGenericPassword(*self.key, None, None, c.byref(item))
        if status == self.not_found:
            return
        self.check(status)
        try:
            self.check(self.security.SecKeychainItemDelete(item))
        finally:
            self.cf.CFRelease(item)
