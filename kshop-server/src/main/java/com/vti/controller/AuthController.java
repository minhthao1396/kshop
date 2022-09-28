package com.vti.controller;

import com.vti.dto.ProfileDTO;
import com.vti.entity.Account;
import com.vti.form.AccountCreateForm;
import com.vti.service.IAccountService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(value = "api/v1/auth")
public class AuthController {
    @Autowired
    private ModelMapper mapper;

    @Autowired
    private IAccountService service;


    @GetMapping("/login")
    public ProfileDTO login(Principal principal) {
        String username = principal.getName();
        Account account = service.findByUsername(username);
        return mapper.map(account, ProfileDTO.class);
    }

    @PostMapping("/register")
    public void register(@RequestBody AccountCreateForm form) {
        service.create(form);
    }
}
