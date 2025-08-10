package com.example.internaltools;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
@EntityScan("com.example.internaltools.entity")
public class InternalToolsApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(InternalToolsApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(InternalToolsApplication.class);
	}

}
