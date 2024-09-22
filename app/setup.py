from setuptools import setup, find_packages

setup(
    name="your_flask_app",                # Name of your project
    version="0.1",                        # Version of your project
    packages=find_packages(),             # Automatically find packages in the current directory
    include_package_data=True,            # Include additional files specified in MANIFEST.in
    install_requires=[                    # Dependencies
        "Flask"
    ],
    author="NKU Data Science Club",
    author_email="gaurabusa@example.com",
    description="NKU Course Navigation",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/TempGaurab/NKU-CourseNav",
    classifiers=[                         # Optional project classifiers
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',              # Specify the Python version required
)