import os
import zipfile

def create_casino_package():
    output_filename = "jillu-aviator-casino-ready-v1.zip"
    exclude_dirs = {"node_modules", ".git", ".next", ".cache"}
    exclude_extensions = {".zip", ".pyc"}

    print(f"Creating casino package: {output_filename}...")
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            # Filter directories in-place
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            for file in files:
                if any(file.endswith(ext) for ext in exclude_extensions):
                    continue
                if file == output_filename:
                    continue
                
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, ".")
                zipf.write(file_path, arcname)
                
    print(f"Successfully created {output_filename} (Size: {os.path.getsize(output_filename) / (1024*1024):.2f} MB)")

if __name__ == "__main__":
    create_casino_package()
