package com.atguigu.demo;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//演示Applicant保存作用域（demo05 demo06）
@WebServlet("/demo05")
//Request请求客户端重定向，并保存作用域
public class Demo05Servlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //1. 向application保存作用域保存数据
        //ServletContext: Servlet上下文
        ServletContext application = req.getServletContext();
        application.setAttribute("uname", "lili");
        //2. 客户端重定向
        resp.sendRedirect("demo06 ");

        //3. 服务器端转发
        // req.getRequestDispatcher("demo04").forward(req,resp);
    }
}