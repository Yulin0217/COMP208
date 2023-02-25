1.设置编码
        // super.doPost(req, resp);
        // post方式下使用下面方法解决乱码问题 request.setCharacterEncoding("UFT-8");
        // get请求目前不需要编码(基于tomcat8之后，之前有特殊的编码方式，不过很少用了 )
        注意，设置编码必须在所有获取参数之前
2.servlet的继承关系
    2.1 javax.servlet.Servlet接口
        2.1.1 javax.servlet.GenericsServlet抽象类
             2.1.1.1 javax.servlet.HttpsServlet

     2.2 相关方法
        javax.servlet.Servlet接口
            void init(config) -初始化方法
            void service(request, response) -服务方法
            void destroy() -销毁方法

        javax.servlet.GenericServlet 接口 抽象类
            void service(request,response)-仍然是抽象的

        javax。servlet.https.HttpServlet 抽象子类
            void service(request, response) -不抽象的
            1. String method = req.getMethod() 获取请求的方法
            2. 各种if判断，根据请求方式的不同，决定去调用不同的do方法
            3. 在HttpServlet这个抽象类中，do方法都差不多




3.servlet的生命周期
    1.从出生到死亡的过程就是生命周期，对应着init(),service(),destroy()的三种方法
    2.默认情况下：
        在第一次接受请求时，这个Servlet会进行实例化（调用构造方法），初始化（调用init），然后
        服务（调用service）从第二次请求开始，每一次都是服务
        当容器关闭时，其中所有的servlet实例都会被销毁，调用销毁的方法。
    3. 通过以上实例我们发现：
        - Servlet实例tomcat只会创建一个，所有的请求实际上是去让这个实例去相应
            - 因为发现刷新网页也不会新建一个servlet
        - 默认情况下，只有在第一次请求时，tomcat才会去实例化，初始化，
            然后再去相应服务。这样的好处是：提高系统的启动速度
            缺点是第一次启动相对来说更慢
        - 因此得出结论：如果需要提高系统的启动速度，当前默认情况就是这样。
            如果需要提高相应速度，我们应该设置servlet的初始化时机。
    4.servlet的启动时机
        - 默认在第一次接受请求时，实例化并初始化
        - 我们可以通过<load-on-startup>1</load-on-startup>来设置servlet启动的先后顺序
            如果有多个servlet需要启动的话。
     5.Servlet在容器当中是：单例的，线程不安全的
        单例的：从上述可知servlet只会创建一个实例，即使有多个访问
        线程不安全的：当多个客户端访问一个Service的时候，
        比如线程1和线程2，那么线程1调用service的方法经过判断语句1执行
        如果此时线程2同时请求，可能会改变判断语句1的参数导致线程1出错。
        （比如num=1是判断语句的条件，线程2的执行语句可能会导致num->2进而导致线程出错）
            - 所以尽量不要在servlet中定义成员变量
              如果必须定义，那么不要根据成员变量的值做一些逻辑判断


4.Https协议
    1  HTTP（Hyper Text Transfer Protocol）：输超文本到本地浏览器的传送协议。
    2. Http是无状态的:
        当PC给服务器发送两个请求时，服务器无法确定这两个请求是从一个客户端发送来的还是
        不同的客户端发送过来的
    3. Http请求包含两个部分：请求和响应
        - 请求：
          请求包含三个部分：1.请求行;2.请求消息头;3.请求主题
        - 请求行
          一般是包含三个信息：
            * 1.请求的方式
            * 2.请求的URL
            * 3.请求的主体
        - 请求消息头：
            * 作用：通过具体的参数对本次请求进行详细的说明
            * 格式：键值对，键和值之间使用冒号隔开
            * 相对来说比较重要的消息头
        - 请求体：
            * 1.get方式，没有请求体，有一个叫queryString
            * 2.post方式，有请求体，form data
            * 3.json格式，有请求体，request payload
    4. 响应报文
        1.响应行 2.响应头 3.响应体
        * 响应行：1.协议
                 2.响应状态码
                 3.响应状态
        * 响应头 ：包含了服务器的信息，服务器发送给浏览器的信息
                 （内容的媒体类型，编码，内容长度）
        * 响应体：响应的实际内容
        （比如请求add.html界面时，响应的内容就死<html>.....巴拉巴拉）
5.会话
    1.http是无状态的：
    当PC给服务器发送两个请求时，服务器无法确定这两个请求是从一个客户端发送来的还是
    不同的客户端发送过来的
     -- 无状态带来的问题：
        比如第一次请求是将商品添加到购物车，第二次是请求结账，
        如果无法区分这两次请求是同一个用户的，就会出问题
     -- 通过会话跟踪技术来解决无状态的问题（给每个用户分配一个编码Session ID）
    2.会话跟踪技术：
     -- 客户端第一次发请求给服务器时，服务器会获取session，如果获取不到，则创建一个新的，然后响应给客户端
     -- 下一次客户端给服务器发请求时，会把SessionID带给服务器那么服务器就可以获取到了，
        那么服务器就可以判断出这一次请求和上一次请求是一个客户端
     -- 常用的API：
        request.getSession() -> 获取当前的会话，没有则创建一个新的会话
        request.getSession(true) -> 效果和不带参数相同
        request.getSession(false) -> 获取当前的会话，没有则不会创建一个新的会话

        session.getId() -> 获取SessionID
        session.isNew() -> 判断当前的session是否是新的
        session.getMaxInactiveInterval() -> session的非激活间隔时长，默认为1800
        //就好像一些长时间不操作就退出的网页
        session.invalidate() ->强制让会话立刻失效
    3.Session的保存作用域
     -- 同一个客户端去进行两个操作，一个去创建一个session，另外一个去获取相应的session
     -- session的保存作用域是和某具体的某一个session对应的
     -- 常用的API：
        void session.setAttribute(k,v)
        Object session.getAttribute(k)
        void removeAttribute(k)

6. 服务器内部转发以及客户端重新定向
    1. 服务器内部转发：request.getRequestDispatcher("....").forward(request, response);
        - 一次请求响应的过程,对于客户端而言，内部经过了多少次转发，客户端是不知道的
        - 地址栏没有变化
    2. 客户端重新定向：response.sendRedirect("....")
        - 两次请求响应的过程。客户端知道请求的URL有变化
        - 地址栏有变化

7. Thymeleaf - 识图模板

8. 路径问题
    1.绝对路径
    2.相对路径







//Error500指网页错误