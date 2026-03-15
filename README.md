## Visit Counter
A fullstack application that shows the number of unique visitors on a website.

For more walkthrough and the technical details, please refer to [this blog](https://example.com).

## How to start
### Windows
- Make sure you have [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) installed. 
We'll run our frontend & backend using Makefile, which requires an installation on Windows.
- In your terminal, type:
```bash
make start 
```
### Mac
- Similar to Windows, but we have `make` installed by default on Mac:
```bash
make start 
```

## Common issues
- The backend uses docker to install redis locally, which can take time to run before the frontend is ready. Make sure you give at least 5 seconds
for the backend to kickstart the docker image & install Python's dependencies.
___
If you encounter a problem that is not listed here, please open an issue at the GitHub repository: https://github.com/petercrackthecode/visit_counter/issues/new 