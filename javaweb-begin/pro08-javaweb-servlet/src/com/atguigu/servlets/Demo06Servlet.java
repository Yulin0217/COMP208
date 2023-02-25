package com.atguigu.servlets;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//演示服务器端的内部转发
public class Demo06Servlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("执行Demo06");
        //服务端内部转发
        // req.getRequestDispatcher("demo07").forward(req,resp);
        //客户端重新发送
        resp.sendRedirect("demo07");
    }
}
