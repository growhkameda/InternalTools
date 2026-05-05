package com.example.internaltools.filter;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class AccessLogFilter extends OncePerRequestFilter {

    private static final Logger accessLogger =
            LoggerFactory.getLogger("ACCESS_LOG");

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
    	String method = request.getMethod();
    	String uri = request.getRequestURI();
    	int status = response.getStatus();

        try {
            MDC.put("method", method);
            MDC.put("uri", uri);

            filterChain.doFilter(request, response);

        } finally {
            MDC.put("status", String.valueOf(status));

            if ("/allmemberview/api/login".equals(uri)) {
            	/* 何もしない (/login時のみControllerで制御しているため)*/
            } else {
                if (status >= 400) {
                    accessLogger.warn("request failed");
                } else {
                    accessLogger.info("access");
                }
            }
            MDC.clear();
        }
    }
}