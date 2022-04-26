
# OIDC Setup (DOCS WIP)

  

## Kubernetes setup

  

1. Make sure to setup the apiserver configuration
	
	| Parameter| Description | Value |
	| ----------- | ----------- | ---------|
	| `apiserver.authorization-mode`| Authorization mode for the api server| RBAC,Node
	| `apiserver.oidc-issuer-url`| URL for the OpenID issuer | https://...
	| `apiserver.oidc-client-id` | Client id provided by the OpenID issuer | asdfasdfasdf
	| `apiserver.oidc-username-claim` | The specific claim the in the JWT token that holds the username of the user | email, name, userID, etc |
	| `apiserver.oidc-groups-claim` | The specific claim the in the JWT token that holds the groups the user is assigned to (for groupwide permissions) | groups |
	| `apiserver.oidc-ca-file` | The certificate authority file provided by your OpenID Issuer (You may not need this. Okta, for example, does not provide one and it works fine) | file path |
	
	You can read more about these options [here](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)

2. Create your user roles
	Say you want to have an admin role, that is equivalent to the `cluster-admin` role:
	```
	kind: ClusterRoleBinding
	apiVersion: rbac.authorization.k8s.io/v1
	metadata:
		name: k8s-admin # internal name of group for kubernetes
	roleRef:
		apiGroup: rbac.authorization.k8s.io
		kind: ClusterRole
		name: cluster-admin
	subjects:
		- kind: Group
		name: k8s-admin # group name included in the OpenID groups claim
	```
	Or a role that can only read pods and services
	
	First create the role
	```
	apiVersion: rbac.authorization.k8s.io/v1
	kind: Role
	metadata:
		namespace: default
		name: k8s-readonly-pods-services # name of the role
	rules:
		- apiGroups: [""] # "" indicates the core API group
		resources: ["pods", "services"]
		verbs: ["get", "watch", "list"]
	```
	Then create the RoleBinding
	```
	kind: RoleBinding
	apiVersion: rbac.authorization.k8s.io/v1
	metadata:
		name: k8s-readonly-group # internal name of group for kubernetes
	roleRef:
		apiGroup: rbac.authorization.k8s.io
		kind: Role
		name: k8s-readonly-pods-services # role created above
	subjects:
		- kind: Group
		name: k8s-readonly-pods-services # group name included in the OpenID groups claim
	```

3. For testing, install [oidc-login](https://github.com/int128/kubelogin), and run the setup using the following command
	```kubectl oidc-login setup --oidc-issuer-url=<ISSUER-URL> --oidc-client-id=<CLIENT-ID> --oidc-client-secret=<CLIENT-SECRET (if provided)>```
4. Set the credentials for a user in the system
	 ```
	 kubectl config set-credentials oidc-user \
			--exec-api-version=client.authentication.k8s.io/v1beta1 \
			--exec-command=kubectl \
			--exec-arg=oidc-login \
			--exec-arg=get-token \
			--exec-arg=--oidc-issuer-url=<ISSUER-URL> \
			--exec-arg=--oidc-client-id=<CLIENT-ID> \
			--exec-arg=--oidc-client-secret=<CLIENT-SECRET> \
			--exec-arg=--oidc-extra-scope="email offline_access profile openid"
	```
The CLIENT-SECRET is optional, however your OpenID Issuer may require one

## Okta specific setup
I have only done this with Okta, so other services may operate differently.
Really good documentation on this: https://developer.okta.com/blog/2021/11/08/k8s-api-server-oidc

1. Create your Okta app
	* Make sure you create a WEB APP in Okta
	* Be sure to grant the `Authorization Code` and `Refresh Token` and `Rotate token after every use`
	* Set the login redirection to `fleet-hostname/api/v1/auth/ouath2/callback` (where fleet-hostname is wherever fleet is running)
	* Set the logout redirection to `fleet-hostname/`
2. Create the Okta groups
	* Going based on the documentation above, you will want to create 2 groups:
		* k8s-admin
		* k8s-readonly-pods-services
3. Add users to those groups
4. Go to `Security > API` 
	* Make note of your `Issuer URI` because we are going to need that for the Kubernetes setup
	* Edit the Authorization server and under Claims, add a new Claim called `groups`,  include it in the `ID Token` type, set the Value Type to `Groups`, and set a filter if you want
5. Head back to your application, and make note of your `Client ID` and `Client Secret`
6. Follow the kubernetes setup instructions above and you should be good to go


## Fleet Parameters

1. `oidc-issuer-url` - OIDC Issuer url
2. `oidc-client-id` - OIDC Client id
3. `oidc-client-secret` - OIDC Client secret
3. `host` - Hostname of where fleet is being served (ex: http://localhost:9095)
