# jiao-tong

此库名为交通，有道是天地交而万物通，其主要功能主要是实现react组件之间的通讯，只要组件之间通讯畅通，写代码便轻松愉快。

## 整体概率

## 如何使用
建议在src源代码目录下创建一个model的目录，将全局状态收纳于此。具体的局部状态，也可以根据实际需要放置于局部文件夹之中。

创建模型，传人类型，会有完美的类型声明
```ts
import { createModel } from 'jiao-tong'
/**
 * 简易组件通信工具，可替代redux
 */
export const { useModel: useCountModel, getData: getCountModel, dispatch: dispatchCountModel, subscribe: subscribeCountModel } = createModel<number>(0)

```
使用模型共享数据，其hook方法和useState基本一模一样，前面是模型的值，后面是该模型对应的修改值的方法，让你无成本爱上这个
```ts
import { useCountModel } from 'src/model'

const AddCountBtn: FC = () => {
  const [count, setCount] = useCountModel()
  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      Add Count
    </button>
  )
}
```
在组件内之中改变countModel的值，其他组件能够直接读到
```ts
function App() {
  const [count] = useCountModel()
  return (
    <div>
      <AddCountBtn />
      <p>count is: {count} (get data from jiao-tong)</p>
    </div>
  )
}
```
因为useCountModel是个hook，只能在函数组件里面使用，如果需要在其它地方获取或者改变对应模型的值，可以直接使用getCountModel和dispatchCountModel，当然，无论你在哪里使用dispatchCountModel去改变值，都会影响和作用于函数组件
```ts
setInterval(() => {
  const count = getCountModel()
  dispatchCountModel(count + 1)
}, 10000)
```

最后的subscribeCountModel方法，传入一个监听函数，一旦数据模型发生改变，这边就可以直接监听到

```ts
subscribeCountModel((count) => {
  console.log(`监听到CountModel的值发生变化`, count)
})
```

## 

