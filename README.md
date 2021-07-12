# React Stateless

### Example

```typescript jsx
import {createRef, useEffect} from 'react';
import useStateless, {useOnlyOnce} from './index';

export default function App() {
  const ref = createRef<HTMLDivElement>();
  const [done, doOnce] = useOnlyOnce();

  const [mapWrapper, triggerChange] = useStateless<AMap | undefined>();

  useEffect(() => {
    if (!done() && ref.current) {
      doOnce();
      mapWrapper.value = new AMap({ ... });
      triggerChange();
    }
  }, [ref, done, doOnce, mapWrapper, triggerChange]);
  
  useEffect(() => {
    if (mapWrapper.value) {
      mapWrapper.value.add(new Marker({}));
    }
  }, [mapWrapper]);

  return <div ref={ref} />;
}
```
