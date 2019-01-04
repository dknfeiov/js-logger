

### js执行错误

当JavaScript运行时错误（包括语法错误）发生时，window会触发一个ErrorEvent接口的error事件，并执行window.onerror()。
所以我们可以通过 window.onerror 事件来监听js运行时错误

> 传递参数
- message：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
- source：发生错误的脚本URL（字符串）
- lineno：发生错误的行号（数字）
- colno：发生错误的列号（数字）
- error：Error对象（对象）


> 当加载自不同域的脚本中发生语法错误时，为避免信息泄露（参见bug 363897），语法错误的细节将不会报告，而代之简单的"Script error."


### 资源加载错误

当一项资源（如<img>或<script>）加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror()处理函数。这些error事件不会向上冒泡到window，不过（至少在Firefox中）能被单一的window.addEventListener捕获。






