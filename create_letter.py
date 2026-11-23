import sys

def create_pdf(text, filename):
    # Simple PDF generator using minimal PDF syntax (no external libs)
    # This creates a single-page PDF with Helvetica font.
    # Reference: PDF 1.4 spec, basic objects.
    # Escape parentheses in text
    def esc(s):
        return s.replace('\\', '\\\\\\').replace('(', '\\(').replace(')', '\\)')
    lines = []
    # Header
    lines.append('%PDF-1.4')
    # Object 1: Catalog
    lines.append('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj')
    # Object 2: Pages
    lines.append('2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj')
    # Object 3: Page
    lines.append('3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj')
    # Object 4: Contents stream
    # Simple text drawing at position (50, 750) moving down line by line.
    txt_obj = []
    txt_obj.append('BT')  # begin text
    txt_obj.append('/F1 12 Tf')  # font Helvetica 12
    y = 750
    for line in text.split('\n'):
        escaped = esc(line)
        txt_obj.append(f'50 {y} Td ({escaped}) Tj')
        y -= 14  # line spacing
    txt_obj.append('ET')  # end text
    content_stream = '\n'.join(txt_obj).encode('utf-8')
    length = len(content_stream)
    lines.append(f'4 0 obj << /Length {length} >> stream')
    lines.append(content_stream.decode('latin1'))
    lines.append('endstream endobj')
    # Object 5: Font (Helvetica)
    lines.append('5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj')
    # Xref table placeholder (will be corrected later)
    # We'll compute byte offsets.
    pdf_bytes = '\n'.join(lines).encode('latin1')
    # Build xref table
    offsets = []
    pos = 0
    for i, line in enumerate(lines):
        offsets.append(pos)
        pos += len(line.encode('latin1')) + 1  # +1 for newline
    # Write PDF with proper xref
    with open(filename, 'wb') as f:
        f.write(pdf_bytes)
        # Write xref
        startxref = f.tell()
        f.write(b'xref\n')
        f.write(f'0 {len(offsets)+1}\n'.encode())
        f.write(b'0000000000 65535 f \n')
        for off in offsets:
            f.write(f'{off:010d} 00000 n \n'.encode())
        f.write(b'trailer << /Size %d /Root 1 0 R >>\n' % (len(offsets)+1))
        f.write(b'startxref\n')
        f.write(f'{startxref}\n'.encode())
        f.write(b'%%EOF')

if __name__ == '__main__':
    letter = """Dear Hiring Manager,
I am writing to express my interest in the Customer Service position with your company. With a strong commitment to customer satisfaction, excellent communication skills, and a professional attitude, I am confident that I would be a valuable addition to your team.
Throughout my career, I have developed the ability to build positive relationships with customers, listen carefully to their needs, and provide effective solutions in a timely manner.
I understand the importance of delivering exceptional service, maintaining professionalism under pressure, and representing the company with integrity and respect.
I am a reliable, adaptable, and results-oriented individual who enjoys helping people and creating positive customer experiences. My ability to work collaboratively with colleagues while maintaining a customer-focused mindset allows me to contribute to both customer satisfaction and organizational success.
I am excited about the opportunity to bring my skills and dedication to your organization and would welcome the chance to discuss how my experience can benefit your team.
Thank you for your time and consideration. I look forward to hearing from you.
Sincerely,
Jose Luis Alvarez avila.
"""
    create_pdf(letter, 'cover_letter.pdf')
    print('PDF generated')
