import './mainCanvas.css'
import { useState } from 'react'

type Item = {
  itemId: string //uuid v4
  name: string
}

export function MainCanvas() {
  const [items, setItems] = useState<Item[]>([]);

  /**
   * Call newItem api 
   * create new projects in /.guitarConversion (with a valid uuid)
   */
  const onNewItem = async () => {
    const apiRes = await fetch("/api/newItem", {method: 'POST'});

    if (!apiRes.ok) {
      const err = await apiRes.json().catch(() => ({}));
      throw new Error(err.error || err.hint || `HTTP ${apiRes.status}`);
    }

    const out = await apiRes.json();
    setItems([...items, {itemId: out.itemId, name: "default project"}])
    
  }

  // ---- UI ----
  const contentComponent = (
    <>
      <header className="topBar">
        <p> Guitar Conversion</p>
      </header>

      <main className="page">
        <div>
          <button
            type="button"
            onClick = { onNewItem }
          >
            New Item 
          </button>
        </div>
        
      <div className="itemRow">
        {items.map((item) => (
          <div key={item.itemId} className="itemBox">
            {item.name}
          </div>
        ))}
      </div>
      </main>
    </>
  )

  return contentComponent
}