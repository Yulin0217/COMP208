package com.atguigu.servlets;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AddServlet extends HttpServlet {
    //负责接受pc端的请求
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // super.doPost(req, resp);
        // post方式下使用下面方法解决乱码问题 request.setCharacterEncoding("UFT-8");
        // get请求目前不需要编码(基于tomcat8之后，之前有特殊的编码方式，不过很少用了 )
        request.setCharacterEncoding("UFT-8");
        System.out.println("寻找对接");
        String fname = request.getParameter("fname"); //获得id为fname的request
        String priceStr = request.getParameter("price");
        Integer price = Integer.parseInt(priceStr);
        String fcountStr = request.getParameter("fcount");
        Integer fcount = Integer.parseInt(fcountStr);
        String remark = request.getParameter("remark");

        System.out.println("fname = "+ fname);
        System.out.println("price = "+ price);
        System.out.println("fcount = "+ fcount);
        System.out.println("remark = "+ remark);
    }
}
