import os
from urllib.parse import quote


# 生成HTML内容
def generate_html(directory, output_file="readingList.html"):
    if not os.path.exists(directory):
        print(f"Error: The directory '{directory}' does not exist.")
        return

    html_content = """
    <html>
    <head>
        <title>Guided Reading</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                margin: 40px;
                padding: 0;
                background-color: #f4f4f4;
            }}
            h1 {{
                color: #2c3e50;
                text-align: center;
                margin-bottom: 30px;
            }}
            ul {{
                list-style-type: none;
                padding: 0;
                max-width: 800px;
                margin: 0 auto;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                border-radius: 8px;
                padding: 20px;
            }}
            li {{
                padding: 10px;
                border-bottom: 1px solid #ccc;
            }}
            li:last-child {{
                border-bottom: none;
            }}
            a {{
                text-decoration: none;
                color: #3498db;
                font-weight: bold;
            }}
            a:hover {{
                color: #2980b9;
            }}
        </style>
    </head>
    <body>
        <h1>Reading List for Freshman</h1>
        <ul>
    """.format(dir_name=directory)

    # 遍历目录和子目录，按字母顺序排序
    for root, dirs, files in os.walk(directory):
        relative_root = os.path.relpath(root, directory)

        # 对子目录和文件进行排序
        dirs.sort()  # 子目录按字母顺序排序
        files.sort()  # 文件按字母顺序排序

        # 列出子目录
        if relative_root != ".":
            html_content += '<li><strong>{}</strong></li>'.format(relative_root)

        # 列出文件
        for file in files:
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, directory)
            url_path = quote(os.path.join(relative_root, file).replace("\\", "/"))  # 保证相对路径包含父目录信息
            html_content += '<li><a href="{0}" target="_blank">{1}</a></li>'.format(url_path, relative_path)

    html_content += """
        </ul>
    </body>
    </html>
    """

    # 写入HTML文件
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"HTML file generated: {output_file}")


# 使用示例
directory_to_list = "./ReadingList"  # 替换为你需要列出的目录路径
generate_html(directory_to_list)
