import { FC, useState } from 'hono/jsx';
import { MainLayout } from './layouts/mainLayout.tsx';

export const Example: FC = () => {
  const [count, setCount] = useState(0);
  return (
    <MainLayout>
      <h1>Example</h1>
      <p>Count: {count}</p>
      <button
        onClick={() => {
          console.log('Incrementing...');
          setCount(count + 1);
        }}
        type="button"
      >
        Increment
      </button>
      <script>const</script>
    </MainLayout>
  );
};
