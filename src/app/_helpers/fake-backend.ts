import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

const accountsKey = 'angular-10-signup-verification-boilerplate-accounts';
const departmentsKey = 'angular-user-management-departments';
const employeesKey = 'angular-user-management-employees';
const workflowsKey = 'angular-user-management-workflows';
const requestsKey = 'angular-user-management-requests';

let accounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
let departments = JSON.parse(localStorage.getItem(departmentsKey) || '[]');
let employees = JSON.parse(localStorage.getItem(employeesKey) || '[]');
let workflows = JSON.parse(localStorage.getItem(workflowsKey) || '[]');
let requests = JSON.parse(localStorage.getItem(requestsKey) || '[]');

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const alertService = this.alertService;

        return handleRoute();
        
        function handleRoute() {
            switch (true) {
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.endsWith('/accounts') && method === 'POST':
                    return createAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                    return deleteAccount();
                
                // Department routes
                case url.endsWith('/departments') && method === 'GET':
                    return getDepartments();
                case url.match(/\/departments\/\d+$/) && method === 'GET':
                    return getDepartmentById();
                case url.endsWith('/departments') && method === 'POST':
                    return createDepartment();
                case url.match(/\/departments\/\d+$/) && method === 'PUT':
                    return updateDepartment();
                case url.match(/\/departments\/\d+$/) && method === 'DELETE':
                    return deleteDepartment();
                
                // Employee routes
                case url.endsWith('/employees') && method === 'GET':
                    return getEmployees();
                case url.match(/\/employees\/\d+$/) && method === 'GET':
                    return getEmployeeById();
                case url.endsWith('/employees') && method === 'POST':
                    return createEmployee();
                case url.match(/\/employees\/\d+$/) && method === 'PUT':
                    return updateEmployee();
                case url.match(/\/employees\/\d+\/transfer$/) && method === 'PUT':
                    return transferEmployee();
                case url.match(/\/employees\/\d+$/) && method === 'DELETE':
                    return deleteEmployee();
                
                // Workflow routes
                case url.endsWith('/workflows') && method === 'GET':
                    return getWorkflows();
                case url.match(/\/workflows\/\d+$/) && method === 'GET':
                    return getWorkflowById();
                case url.endsWith('/workflows') && method === 'POST':
                    return createWorkflow();
                case url.match(/\/workflows\/\d+$/) && method === 'PUT':
                    return updateWorkflow();
                case url.match(/\/workflows\/\d+$/) && method === 'DELETE':
                    return deleteWorkflow();
                
                // Request routes
                case url.endsWith('/requests') && method === 'GET':
                    return getRequests();
                case url.match(/\/requests\/\d+$/) && method === 'GET':
                    return getRequestById();
                case url.endsWith('/requests') && method === 'POST':
                    return createRequest();
                case url.match(/\/requests\/\d+$/) && method === 'PUT':
                    return updateRequest();
                case url.match(/\/requests\/\d+$/) && method === 'DELETE':
                    return deleteRequest();
                
                default:
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { email, password }: { email: string; password: string } = body;
            const account = accounts.find((x: any) => x.email === email && x.password === password && x.isVerified);
        
            if (!account) return error('Email or password is incorrect');
        
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        function refreshToken() {
            const refreshToken: string | null = getRefreshToken();
        
            if (!refreshToken) return unauthorized();
        
            const account = accounts.find((x: any) => x.refreshTokens.includes(refreshToken));
        
            if (!account) return unauthorized();
        
            account.refreshTokens = account.refreshTokens.filter((x: string) => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();
            
            const refreshToken = getRefreshToken();
            const account = accounts.find((x: any) => x.refreshTokens.includes(refreshToken));
            
            // revoke token and save
            account.refreshTokens = account.refreshTokens.filter((x: any) => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({});
        }

        function register() {
            const account = body;
            
            if (accounts.find((x: any) => x.email === account.email)) {
                // display email already registered "email" in alert
                setTimeout(() => {
                    alertService.info(`
                        <h4>Email Already Registered</h4>
                        <p>Your email ${account.email} is already registered.</p>
                        <p>If you forgot your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>
                        <div><strong>NOTE:</strong> If you read this, you stupid!</div>
                    `, { autoClose: false });
                }, 1000);
                
                // always return ok() response to prevent email enumeration
                return ok({});
            }
            
            // assign account id and a few other properties then save
            account.id = newAccountId();
            if (account.id === 1) {
                // first registered account is an admin
                account.role = Role.Admin;
            } else {
                account.role = Role.User;
            }
            account.dateCreated = new Date().toISOString();
            account.verificationToken = new Date().getTime().toString();
            account.isVerified = false;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            // display verification email in alert
            setTimeout(() => {
                const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
                alertService.info(`
                    <h4>Verification Email</h4>
                    <p>Thanks for registering!</p>
                    <p>Please click the below link to verify your email address:</p>
                    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                    <div><strong>NOTE:</strong> If you read this, you stupid!</div>
                `, { autoClose: false });
            }, 1000);

            return ok({});
        }

        function verifyEmail() {
            const { token } = body;
            const account = accounts.find((x: any) => !!x.verificationToken && x.verificationToken === token);
            
            if (!account) return error('Verification failed');
            
            // set is verified flag to true if token is valid
            account.isVerified = true;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            return ok({});
        }

        function forgotPassword() {
            const { email } = body;
            const account = accounts.find((x: any) => x.email === email);
            
            // always return ok() response to prevent email enumeration
            if (!account) return ok({});
            
            // create reset token that expires after 24 hours
            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            // display password reset email in alert
            setTimeout(() => {
                const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
                alertService.info(`
                    <h4>Reset Password Email</h4>
                    <p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <div><strong>NOTE:</strong> If you read this, you stupid!</div>
                `, { autoClose: false });
            }, 1000);
            
            return ok({});
        }

        function validateResetToken() {
            const { token } = body;
            const account = accounts.find((x: any) =>
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
            
            if (!account) return error('Invalid token');
            
            return ok({});
        }

        function resetPassword() {
            const { token, password } = body;
            const account = accounts.find((x: any) =>
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
            
            if (!account) return error('Invalid token');
            
            // update password and remove reset token
            account.password = password;
            account.isVerified = true;
            delete account.resetToken;
            delete account.resetTokenExpires;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            return ok({});
        }

        function getAccounts() {
            if (!isAuthenticated()) return unauthorized();
            return ok(accounts.map((x: any) => basicDetails(x)));
        }

        function getAccountById() {
            if (!isAuthenticated()) return unauthorized();

            let account = accounts.find((x: any) => x.id === idFromUrl());
            
            // user accounts can get own profile and admin accounts can get all profiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
            
            return ok(basicDetails(account));
        }

        function createAccount() {
            if (!isAuthorized(Role.Admin)) return unauthorized();
        
            const account = body;
            if (accounts.find((x: any) => x.email === account.email)) {
                return error(`Email ${account.email} is already registered`);
            }
            
            // assign account id and a few other properties then save
            account.id = newAccountId();
            account.dateCreated = new Date().toISOString();
            account.isVerified = true;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({});
        }

        function updateAccount() {
            if (!isAuthenticated()) return unauthorized();
            
            let params = body;
            let account = accounts.find((x: any) => x.id === idFromUrl());
            
            // user accounts can update own profile and admin accounts can update all profiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
            
            // only update password if included
            if (!params.password) {
                delete params.password;
            }
            // don't save confirm password
            delete params.confirmPassword;
            
            // update and save account
            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            return ok(basicDetails(account));
        }

        function deleteAccount() {
            if (!isAuthenticated()) return unauthorized();
            
            let account = accounts.find((x: any) => x.id === idFromUrl());
            
            // user accounts can delete own account and admin accounts can delete any account
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
            
            // delete account then save
            accounts = accounts.filter((x: any) => x.id !== idFromUrl());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok({});
        }

        // Department-related functions
        function getDepartments() {
            if (!isAuthenticated()) return unauthorized();
            return ok(departments);
        }

        function getDepartmentById() {
            if (!isAuthenticated()) return unauthorized();
            
            const id = idFromUrl();
            const department = departments.find((x: any) => x.id === id);
            
            if (!department) return notFound();
            
            return ok(department);
        }

        function createDepartment() {
            if (!isAuthenticated() || !isAuthorized(Role.Admin)) return unauthorized();
            
            const department = body;
            
            // Check if department name already exists
            if (departments.find((x: any) => x.name.toLowerCase() === department.name.toLowerCase())) {
                return error(`Department name '${department.name}' already exists`);
            }
            
            department.id = departments.length ? Math.max(...departments.map((x: any) => x.id)) + 1 : 1;
            departments.push(department);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            
            return ok(department);
        }

        function updateDepartment() {
            if (!isAuthenticated() || !isAuthorized(Role.Admin)) return unauthorized();
            
            const id = idFromUrl();
            const department = departments.find((x: any) => x.id === id);
            
            if (!department) return notFound();
            
            const params = body;
            
            // Check if department name already exists (excluding current department)
            if (params.name && 
                departments.find((x: any) => x.id !== id && x.name.toLowerCase() === params.name.toLowerCase())) {
                return error(`Department name '${params.name}' already exists`);
            }
            
            Object.assign(department, params);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            
            return ok(department);
        }

        function deleteDepartment() {
            if (!isAuthenticated() || !isAuthorized(Role.Admin)) return unauthorized();
            
            const id = idFromUrl();
            
            // Check if department has employees
            if (employees.some((x: any) => x.departmentId === id)) {
                return error('Cannot delete department with employees');
            }
            
            departments = departments.filter((x: any) => x.id !== id);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            
            return ok({});
        }

        // Employee-related functions
        function getEmployees() {
            if (!isAuthenticated()) return unauthorized();
            
            // Add account and department details to employees
            const employeesWithDetails = employees.map((employee: any) => {
                return {
                    ...employee,
                    account: accounts.find((a: any) => a.id === employee.accountId),
                    department: departments.find((d: any) => d.id === employee.departmentId)
                };
            });
            
            return ok(employeesWithDetails);
        }

        function getEmployeeById() {
            if (!isAuthenticated()) return unauthorized();
            
            const id = idFromUrl();
            const employee = employees.find((x: any) => x.id === id);
            
            if (!employee) return notFound();
            
            // Add account and department details
            const employeeWithDetails = {
                ...employee,
                account: accounts.find((a: any) => a.id === employee.accountId),
                department: departments.find((d: any) => d.id === employee.departmentId)
            };
            
            return ok(employeeWithDetails);
        }

        function createEmployee() {
            if (!isAuthenticated() || !isAuthorized(Role.Admin)) return unauthorized();
            
            const employee = body;
            
            // Convert string ids to numbers
            employee.accountId = parseInt(employee.accountId);
            employee.departmentId = parseInt(employee.departmentId);
            
            // Validate account and department exist
            if (!accounts.some((x: any) => x.id === employee.accountId)) {
                return error('Account not found');
            }
            
            if (!departments.some((x: any) => x.id === employee.departmentId)) {
                return error('Department not found');
            }
            
            // Check if account already has an employee record
            if (employees.some((x: any) => x.accountId === employee.accountId)) {
                return error('Account already has an employee record');
            }
            
            // Generate employee ID if not provided
            if (!employee.employeeId) {
                employee.employeeId = 'EMP' + String(employees.length + 1).padStart(3, '0');
            }
            
            employee.id = employees.length ? Math.max(...employees.map((x: any) => x.id)) + 1 : 1;
            employee.created = new Date().toISOString();
            employee.status = employee.status || 'Active';
            employees.push(employee);
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            
            // If this is a new employee, create an onboarding workflow
            const workflow = {
                id: workflows.length ? Math.max(...workflows.map((x: any) => x.id)) + 1 : 1,
                employeeId: employee.id,
                type: 'Onboarding',
                description: 'Initial onboarding process',
                status: 'Pending',
                created: new Date().toISOString()
            };
            
            workflows.push(workflow);
            localStorage.setItem(workflowsKey, JSON.stringify(workflows));
            
            return ok(employee);
        }

        function updateEmployee() {
            if (!isAuthenticated() || !isAuthorized(Role.Admin)) return unauthorized();
            
            const id = idFromUrl();
            const employee = employees.find((x: any) => x.id === id);
            
            if (!employee) return notFound();
            
            const params = body;
            
            // Convert string id to number if present
            if (params.departmentId) {
                params.departmentId = parseInt(params.departmentId);
                
                // Validate department exists
                if (!departments.some((x: any) => x.id === params.departmentId)) {
                    return error('Department not found');
                }
            }
            
            Object.assign(employee, params);
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            
            return ok(employee);
        }

        function transferEmployee() {
            if (!isAuthenticated() || !isAuthorized(Role.Admin)) return unauthorized();
            
            const id = idFromUrl();
            const employee = employees.find((x: any) => x.id === id);
            
            if (!employee) return notFound();
            
            const { departmentId } = body;
            const targetDeptId = parseInt(departmentId);
            
            // Validate department exists
            if (!departments.some((x: any) => x.id === targetDeptId)) {
                return error('Department not found');
            }
            
            // Don't transfer if already in this department
            if (employee.departmentId === targetDeptId) {
                return error('Employee is already in this department');
            }
            
            // Update employee department
            employee.departmentId = targetDeptId;
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            
            // Create a transfer workflow
            const workflow = {
                id: workflows.length ? Math.max(...workflows.map((x: any) => x.id)) + 1 : 1,
                employeeId: employee.id,
                type: 'Transfer',
                description: `Transfer to ${departments.find((x: any) => x.id === targetDeptId)?.name}`,
                status: 'Pending',
                created: new Date().toISOString()
            };
            
            workflows.push(workflow);
            localStorage.setItem(workflowsKey, JSON.stringify(workflows));
            
            return ok(employee);
        }

        function deleteEmployee() {
            if (!isAuthenticated() || !isAuthorized(Role.Admin)) return unauthorized();
            
            const id = idFromUrl();
            
            // Check for related workflows and requests
            if (workflows.some((x: any) => x.employeeId === id)) {
                return error('Cannot delete employee with workflows');
            }
            
            if (requests.some((x: any) => x.employeeId === id)) {
                return error('Cannot delete employee with requests');
            }
            
            employees = employees.filter((x: any) => x.id !== id);
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            
            return ok({});
        }

        // Workflow-related functions
        function getWorkflows() {
            if (!isAuthenticated()) return unauthorized();
            
            const workflowsWithDetails = workflows.map((workflow: any) => {
                const employee = employees.find((e: any) => e.id === workflow.employeeId);
                return {
                    ...workflow,
                    employee: employee ? {
                        ...employee,
                        account: accounts.find((a: any) => a.id === employee.accountId),
                        department: departments.find((d: any) => d.id === employee.departmentId)
                    } : undefined
                };
            });
            
            return ok(workflowsWithDetails);
        }

        function getWorkflowById() {
            if (!isAuthenticated()) return unauthorized();
            
            const id = idFromUrl();
            const workflow = workflows.find((x: any) => x.id === id);
            
            if (!workflow) return notFound();
            
            const employee = employees.find((e: any) => e.id === workflow.employeeId);
            
            const workflowWithDetails = {
                ...workflow,
                employee: employee ? {
                    ...employee,
                    account: accounts.find((a: any) => a.id === employee.accountId),
                    department: departments.find((d: any) => d.id === employee.departmentId)
                } : undefined
            };
            
            return ok(workflowWithDetails);
        }

        function createWorkflow() {
            if (!isAuthenticated()) return unauthorized();
            
            const workflow = body;
            
            // Convert employee ID to number
            workflow.employeeId = parseInt(workflow.employeeId);
            
            // Validate employee exists
            if (!employees.some((x: any) => x.id === workflow.employeeId)) {
                return error('Employee not found');
            }
            
            workflow.id = workflows.length ? Math.max(...workflows.map((x: any) => x.id)) + 1 : 1;
            workflow.status = 'Pending';
            workflow.created = new Date().toISOString();
            
            workflows.push(workflow);
            localStorage.setItem(workflowsKey, JSON.stringify(workflows));
            
            return ok(workflow);
        }

        function updateWorkflow() {
            if (!isAuthenticated()) return unauthorized();
            
            const id = idFromUrl();
            const workflow = workflows.find((x: any) => x.id === id);
            
            if (!workflow) return notFound();
            
            const params = body;
            
            // Only allow updating status and description
            if (params.status) workflow.status = params.status;
            if (params.description !== undefined) workflow.description = params.description;
            
            localStorage.setItem(workflowsKey, JSON.stringify(workflows));
            
            return ok(workflow);
        }

        function deleteWorkflow() {
            if (!isAuthenticated() || !isAuthorized(Role.Admin)) return unauthorized();
            
            const id = idFromUrl();
            
            workflows = workflows.filter((x: any) => x.id !== id);
            localStorage.setItem(workflowsKey, JSON.stringify(workflows));
            
            return ok({});
        }

        // Request-related functions
        function getRequests() {
            if (!isAuthenticated()) return unauthorized();
            
            const requestsWithDetails = requests.map((request: any) => {
                const employee = employees.find((e: any) => e.id === request.employeeId);
                return {
                    ...request,
                    employee: employee ? {
                        ...employee,
                        account: accounts.find((a: any) => a.id === employee.accountId),
                        department: departments.find((d: any) => d.id === employee.departmentId)
                    } : undefined
                };
            });
            
            // Filter to only show admin's requests or user's own requests
            const currentUser = currentAccount();
            if (currentUser.role !== Role.Admin) {
                const currentEmployee = employees.find((e: any) => e.accountId === currentUser.id);
                if (currentEmployee) {
                    return ok(requestsWithDetails.filter((r: any) => r.employeeId === currentEmployee.id));
                }
                return ok([]);
            }
            
            return ok(requestsWithDetails);
        }

        function getRequestById() {
            if (!isAuthenticated()) return unauthorized();
            
            const id = idFromUrl();
            const request = requests.find((x: any) => x.id === id);
            
            if (!request) return notFound();
            
            // Check if user is admin or the request belongs to the user
            const currentUser = currentAccount();
            if (currentUser.role !== Role.Admin) {
                const currentEmployee = employees.find((e: any) => e.accountId === currentUser.id);
                if (!currentEmployee || currentEmployee.id !== request.employeeId) {
                    return unauthorized();
                }
            }
            
            const employee = employees.find((e: any) => e.id === request.employeeId);
            
            const requestWithDetails = {
                ...request,
                employee: employee ? {
                    ...employee,
                    account: accounts.find((a: any) => a.id === employee.accountId),
                    department: departments.find((d: any) => d.id === employee.departmentId)
                } : undefined
            };
            
            return ok(requestWithDetails);
        }

        function createRequest() {
            if (!isAuthenticated()) return unauthorized();
            
            const request = body;
            
            // Get the current employee based on the logged-in user
            const currentUser = currentAccount();
            const currentEmployee = employees.find((e: any) => e.accountId === currentUser.id);
            
            // If not admin, force employeeId to be the current user's employee ID
            if (currentUser.role !== Role.Admin) {
                if (!currentEmployee) return error('No employee record found for your account');
                request.employeeId = currentEmployee.id;
            } else if (request.employeeId) {
                // Admin can specify an employee
                request.employeeId = parseInt(request.employeeId);
                
                // Validate employee exists
                if (!employees.some((x: any) => x.id === request.employeeId)) {
                    return error('Employee not found');
                }
            } else {
                return error('Employee ID is required');
            }
            
            request.id = requests.length ? Math.max(...requests.map((x: any) => x.id)) + 1 : 1;
            request.status = 'Pending';
            request.created = new Date().toISOString();
            
            // Handle request items if present
            if (request.requestItems && Array.isArray(request.requestItems)) {
                request.requestItems.forEach((item: any, index: number) => {
                    item.id = index + 1;
                    item.requestId = request.id;
                });
            }
            
            requests.push(request);
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            
            return ok(request);
        }

        function updateRequest() {
            if (!isAuthenticated()) return unauthorized();
            
            const id = idFromUrl();
            const request = requests.find((x: any) => x.id === id);
            
            if (!request) return notFound();
            
            // Check permissions
            const currentUser = currentAccount();
            if (currentUser.role !== Role.Admin) {
                const currentEmployee = employees.find((e: any) => e.accountId === currentUser.id);
                if (!currentEmployee || currentEmployee.id !== request.employeeId) {
                    return unauthorized();
                }
                
                // Regular users can only update the description and request items
                const params = {
                    description: body.description,
                    requestItems: body.requestItems
                };
                
                // Update request items
                if (params.requestItems && Array.isArray(params.requestItems)) {
                    params.requestItems.forEach((item: any, index: number) => {
                        if (!item.id) item.id = index + 1;
                        item.requestId = request.id;
                    });
                    request.requestItems = params.requestItems;
                }
                
                if (params.description !== undefined) request.description = params.description;
            } else {
                // Admins can update everything
                const params = body;
                
                // Update request items if present
                if (params.requestItems && Array.isArray(params.requestItems)) {
                    params.requestItems.forEach((item: any, index: number) => {
                        if (!item.id) item.id = index + 1;
                        item.requestId = request.id;
                    });
                    request.requestItems = params.requestItems;
                    delete params.requestItems;
                }
                
                // Update other fields
                Object.assign(request, params);
            }
            
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            
            return ok(request);
        }

        function deleteRequest() {
            if (!isAuthenticated()) return unauthorized();
            
            const id = idFromUrl();
            const request = requests.find((x: any) => x.id === id);
            
            if (!request) return notFound();
            
            // Check permissions
            const currentUser = currentAccount();
            if (currentUser.role !== Role.Admin) {
                const currentEmployee = employees.find((e: any) => e.accountId === currentUser.id);
                if (!currentEmployee || currentEmployee.id !== request.employeeId || request.status !== 'Pending') {
                    return unauthorized();
                }
            }
            
            requests = requests.filter((x: any) => x.id !== id);
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            
            return ok({});
        }

        // helper functions

        function ok(body: any): Observable<HttpEvent<any>> {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: string): Observable<never> {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize());
            // call materialize and dematerialize to ensure delay even if an error is thrown
        }

        function unauthorized(): Observable<never> {
            return throwError({ status: 401, error: { message: 'Unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function notFound(): Observable<never> {
            return throwError({ status: 404, error: { message: 'Not Found' } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(account: any): {
            id: number;
            title: string;
            firstName: string;
            lastName: string;
            email: string;
            role: Role;
            dateCreated: string;
            isVerified: boolean;
        } {
            const { id, title, firstName, lastName, email, role, dateCreated, isVerified } = account;
            return { id, title, firstName, lastName, email, role, dateCreated, isVerified };
        }

        function isAuthenticated(): boolean {
            return !!currentAccount();
        }

        function isAuthorized(role: Role): boolean {
            const account = currentAccount();
            if (!account) return false;
            return account.role === role;
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function currentAccount() {
            // check if jwt token is in auth header
            const authHeader = headers.get('Authorization');
            if (!authHeader?.startsWith('Bearer fake-jwt-token.')) return;

            const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
            const tokenExpired = Date.now() >= jwtToken.exp * 1000;
            if (tokenExpired) return;

            const account = accounts.find((x: any) => x.id === jwtToken.id);
            return account;
        }

        function getRefreshToken() {
            // Check if token is in authorization header
            const refreshToken = headers.get('X-Refresh-Token');
            if (refreshToken) return refreshToken;
            // If not in header, check if it's in the request body
            if (body && body.refreshToken) return body.refreshToken;
            
            return null;
        }
        
        function generateJwtToken(account: any): string {
            // create token that expires in 15 minutes
            const tokenPayload = { 
                exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000), // expiration time in seconds
                id: account.id // account ID
            };
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }

        function generateRefreshToken() {
            // Generate a simple timestamp-based token
            const token = new Date().getTime().toString();
            
            const expires = new Date(Date.now() + 7*24*60*60*1000).toISOString();
            document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`; // 7 days expiration
            
            return token;
        }

        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map((x: any) => x.id)) + 1 : 1;
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};