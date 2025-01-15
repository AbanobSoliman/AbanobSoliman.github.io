# AbanobSoliman.github.io

This repository contains the **personal website** of **Dr. Abanob Soliman**, featuring:

- A **Home** section with a personal photo and introductory text.  
- A **CV** section displaying professional experience, academic background, funded projects, technical skills, and references.  
- A **Publications** section listing peer-reviewed works and seminar contributions.  
- A **Projects** section highlighting key funded projects and any other additional projects.  
- A **Contact** section, including an email, phone number, and links to LinkedIn/GitHub.

## How to Use

1. **Clone** or **fork** this repository.

2. **Open** `index.html` in your browser to view the site locally.

3. If you wish to deploy via **GitHub Pages**:
   - Go to your repository’s **Settings** > **Pages**.
   - Under **Build and deployment**, select your branch (usually `main`) and choose the **root** folder or `/docs` folder depending on how you structure your repo.
   - Click **Save**.  
   - After a few seconds, your site should be live at `https://<your-username>.github.io/`.

4. **Add your personal photo**:
   - In `index.html`, locate this snippet:
     ```html
     <img 
       src="img/AbanobSoliman.png" 
       alt="Abanob Soliman" 
       class="profile-image" 
     />
     ```
   - Replace the `src` value with the path to your own image. Make sure you upload the image to `img/` folder or the correct directory.

5. **Edit** your personal details:
   - Modify any text in `index.html`, especially email, phone, upcoming position, references, etc.

6. **Customize** the **style**:
   - If you want to adjust colors, typography, or layout, edit `style.css` to match your taste.

7. **Commit and push** your changes:
   - GitHub Pages will re-deploy your updated site automatically.

## Dependencies

No external libraries (like Bootstrap) are used here; everything is written in pure HTML, CSS, and JavaScript for easy portability. If you want to add frameworks (e.g., Bootstrap, Tailwind, or React), feel free to adjust the structure accordingly.

## Contributing

Pull requests to enhance the site’s design or functionality are welcome. Please open an issue first to discuss any major changes.

## License

This repository is provided for personal use. All content (text and images) belongs to **Dr. Abanob Soliman** and may contain personal information. You may reuse portions of the HTML/CSS/JS code, but please remove/replace any personal data or images if you do so.
