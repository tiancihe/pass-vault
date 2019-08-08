# Pass Vault

A command line tool for managing secrets.

```
npm i -g pass-vault
```

## Commands

### Gen

```
pass gen
```

Generate a password.

### Login

```
pass login USER SECRET
```

Pass Vault will create different store files named ${USER}.store.json for each USER.

Once logged in:

### Save

```
pass save foo --Account bar@foo.com --Password foobarbaz
```

You can save key-value pairs as many as you want, for example, you might want to add other information like ` --url https://foo.com `.

### Find

```
pass find foo

# This will print:
# foo:
# Account: bar@foo.com
# Password: foobarbaz
```

### Logout

```
pass logout
```

Note: logout will not remove your store file.
