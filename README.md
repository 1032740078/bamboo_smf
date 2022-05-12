**有限状态机**

用于编排复杂的流程业务,如订单流转,审批流程

# 安装

```
npm install bamboo_smf -S
```

# 使用
```
const Smf = require('bamboo_smf');
const circuit1 = new Smf()
//订单正常流程
circuit1.init('order', 'new')
.push('new', 'order.pay')
.push('pay', 'order.confirm', 'refund.start')
.push('confirm', 'order.end')
.push('end')



const circuit2 = new Smf()
//订单退款流程
circuit2.init('refund', 'start')
.push('start', 'refund.reimburse')
.push('reimburse', 'refund.end')
.push('end')

const processFlow = new Smf()
//把编排好的流程数据导入
processFlow.setSmfDataList([
circuit1.getSmfData(),
circuit2.getSmfData(),
])

//监听流程变更
processFlow.on((e, paras) => {
    console.log(e,paras);
})

//跳转下个流程
processFlow.setStatus('order.new').nextTo()
// or 
processFlow.nextTo('order.new')
```

# Smf.init

定义初始值状态
```
const circuit = new Smf()
circuit.init('状态链名称', '初始状态')
```

# Smf.push

添加转变内容
```
circuit.push('状态名称', '下一个流程地址(区块名称.状态名称)','异常时的流程地址(区块名称.状态名称)')
```


# Smf.getSmfData

获取全部定义的json数据
```
circuit.getSmfData()
```

# Smf.setSmfDataList

设置所有区块数据
```
circuit.setSmfDataList([区块数据])
```


# Smf.setStatus

设置当前状态
```
circuit.setStatus('当前状态(区块名称.状态名称)')
```

# Smf.get

获取当前状态的数据
```
circuit.get()
```

# Smf.getStatusName

获取当前状态的名称
```
circuit.getStatusName()
```

# Smf.getCurrentState

获取当前区域和状态
```
circuit.getCurrentState()
```

# Smf.getTo

获取当前状态的to区域和状态
```
circuit.getTo()
```

# Smf.getErr

获取当前状态的err区域和状态
```
circuit.getErr()
```

# Smf.next

按当前状态跳转下一个
```
circuit.next('事件:to,err','跳转时可以重新定义当前状态','事件入参')
```


# Smf.nextTo

按当前状态跳转到to
```
circuit.next('跳转时可以重新定义当前状态','事件入参')
```

# Smf.nextErr

按当前状态跳转到err
```
circuit.next('跳转时可以重新定义当前状态','事件入参')
```

# Smf.on

触发跳转时的事件
```
circuit.on((e, paras) => {
    console.log(e,paras);
   /**
    e:当前状态数据: {
      status_name: 'ling',
      to: 'test.end',
      err: '',
      currentState: 'test.ling'
    }
   **/
})


```
