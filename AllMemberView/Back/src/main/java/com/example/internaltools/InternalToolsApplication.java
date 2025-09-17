package com.example.internaltools;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportRuntimeHints;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.example.internaltools.config.JjwtRuntimeHints;

@SpringBootApplication
@EntityScan("com.example.internaltools.entity")
@EnableJpaRepositories("com.example.internaltools.repository")
@ImportRuntimeHints(JjwtRuntimeHints.class)
public class InternalToolsApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(InternalToolsApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(InternalToolsApplication.class);
	}

}
