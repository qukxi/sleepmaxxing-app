const fs = require('fs');
const path = require('path');

// 1. Patch RuntimeScheduler.h
const headerPath = path.join(
  __dirname,
  '../node_modules/expo-modules-jsi/apple/Sources/ExpoModulesJSI-Cxx/include/RuntimeScheduler.h'
);

if (fs.existsSync(headerPath)) {
  let header = fs.readFileSync(headerPath, 'utf8');
  header = header.replace(/SWIFT_RETURNS_RETAINED RuntimeScheduler/g, 'RuntimeScheduler');
  fs.writeFileSync(headerPath, header, 'utf8');
  console.log('[Patch] Successfully patched RuntimeScheduler.h');
}

// 2. Patch JavaScriptRuntime.swift
const swiftPath = path.join(
  __dirname,
  '../node_modules/expo-modules-jsi/apple/Sources/ExpoModulesJSI/Runtime/JavaScriptRuntime.swift'
);

if (fs.existsSync(swiftPath)) {
  let swift = fs.readFileSync(swiftPath, 'utf8');

  // Insert UnsafeSendableBox definition if not present
  if (!swift.includes('struct UnsafeSendableBox')) {
    const importMarker = 'internal import jsi\n';
    const boxCode = `internal import jsi\n
/// Carries a call-scoped raw pointer into the @JavaScriptActor closures
internal struct UnsafeSendableBox<Value>: @unchecked Sendable {
  let value: Value
  @inline(__always) init(_ value: Value) { self.value = value }
}\n`;
    swift = swift.replace(importMarker, boxCode);
  }

  // Replace nonisolated(unsafe) with UnsafeSendableBox
  swift = swift.replace(
    /nonisolated\(unsafe\) let resultPtr = resultPtr/g,
    'let resultPtr = UnsafeSendableBox(resultPtr)'
  );
  swift = swift.replace(
    /nonisolated\(unsafe\) let thisPtr = thisPtr/g,
    'let thisPtr = UnsafeSendableBox(thisPtr)'
  );
  swift = swift.replace(
    /nonisolated\(unsafe\) let argumentsPtr = argumentsPtr/g,
    'let argumentsPtr = UnsafeSendableBox(argumentsPtr)'
  );

  // Replace usages with .value
  swift = swift.replace(
    /writeJSIValue\(to: resultPtr\)/g,
    'writeJSIValue(to: resultPtr.value)'
  );
  swift = swift.replace(
    /mutating: thisPtr\)\.move\(\)/g,
    'mutating: thisPtr.value).move()'
  );
  swift = swift.replace(
    /start: argumentsPtr,/g,
    'start: argumentsPtr.value,'
  );
  swift = swift.replace(
    /runtime\.pointee, thisPtr\)/g,
    'runtime.pointee, thisPtr.value)'
  );

  fs.writeFileSync(swiftPath, swift, 'utf8');
  console.log('[Patch] Successfully patched JavaScriptRuntime.swift');
}
