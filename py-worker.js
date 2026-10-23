// Runs Python (Pyodide) off the main thread so a runaway loop can be killed.
importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js', 'data.js');

let py;
const decoder = new TextDecoder();
let out = '';
const write = buf => { out += decoder.decode(buf); return buf.length; };

const ready = loadPyodide().then(p => {
  py = p;
  py.setStdout({ write });
  py.setStderr({ write });
  py.setStdin({ error: true });
  postMessage({ type: 'ready' });
});

function seed() {
  for (const [name, text] of Object.entries(FILES)) py.FS.writeFile(name, text);
}

function clean(err) {
  const msg = String((err && err.message) || err).trim();
  const lines = msg.split('\n');
  const at = [...msg.matchAll(/File "<exec>", line (\d+)/g)].pop();
  return { error: lines[lines.length - 1], line: at ? +at[1] : null };
}

onmessage = async ({ data: { id, code, test } }) => {
  await ready;
  out = '';
  try { await py.loadPackagesFromImports(code); } catch (e) { /* reported when the import runs */ }
  postMessage({ type: 'started', id });
  seed();
  const ns = py.toPy({});
  try {
    await py.runPythonAsync(code, { globals: ns });
  } catch (e) {
    ns.destroy();
    postMessage({ id, ok: false, out, ...clean(e) });
    return;
  }
  let testErr = null;
  if (test) {
    try { await py.runPythonAsync(test, { globals: ns }); } catch (e) { testErr = clean(e).error; }
  }
  ns.destroy();
  postMessage({ id, ok: true, out, testErr });
};
