# Improvements

- a refresh token system could be added
- uniqueness on user names could be added
- a better logging approach could be used (firebase or OAuth)
- explain why using this custom config manager. It is flexible and doesn't require
  too much overhead, for small sized projects i've found it very useful and quick to use.

# What is done

- authentication with JWT & guard with "isPublic" route decorator
- validation of dto properties
- swagger open api for easy interaction and client side generation
- base response & base response interceptor (in std with Nest structure)
