import { createSignal } from 'solid-js'

export function Counter() {
  const [n, setN] = createSignal(0)
  return <button id="counter" onClick={() => setN(n() + 1)}>count {n()}</button>
}
