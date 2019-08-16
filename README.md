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

Flags:
- -t | --type

    default to 1

    0: includes only numbers

    1: includes numbers and characters
- -l | --length

    default to 8

### Login

```
pass login USER SECRET
```

PassVault will create different store files named USER.store.json for each USER.

Secret is your encryption key, at least 4 characters, required.

Note that:
    PassVault will try to repeate your secret until 16 characters long.
    This is because the encryptor used internally requires a key at least 16 characters long.

## Once logged in:

### Save

```
pass save foo --Account bar@foo.com --Password foobarbaz
```

You can save key-value pairs as many as you want.

For example, you might want to add other information like ` --url https://foo.com ` later.

If you save a new item which actually exists in the your store, your information will be updated, and overwritten.

### Find

```
pass find foo

# This will print:
# foo:
# Account: bar@foo.com
# Password: foobarbaz
```

### Clip

```
pass clip gmail password

# This will clip your gmail's password to your clipboard.
```

Currently supports windows and wsl ubuntu.

### List

```
pass list
```

Print all your saved items' name.

### Logout

```
pass logout
```

Note: logout will not remove your store file, you can login later and continue to use.

### Backup

```
pass backup
```

Backup your store file (encrypted) to cwd (current working directory).

Note that:
    Your backup file will have a format like this:
    `USER.store.json-TIMESTAMP`
    Please keep this format untouched.

### Restore

```
pass backup
```

Restore your store from a backup file.

Note that: yout should provide a relative path. e.g. USER.store.json-TIMESTAMP

### Export

```
pass export
```

Export your secrets (unencrypted) to cwd, use with caution.