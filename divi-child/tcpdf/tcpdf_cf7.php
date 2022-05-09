<?php
class CREATE_FPDFCF7
{
    public function CREATE_FPDFCF7Fn($name, $lektion, $savepath)
    {

        // include the main TCPDF library
        require_once('config/tcpdf_config.php');
        require_once('tcpdf.php');
        // create new pdf document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, PDF_MARGIN_TOP, PDF_MARGIN_LEFT, true, 'UTF-8', false);
        // set document information
        $pdf->SetCreator(PDF_CREATOR);
        $pdf->SetAuthor('Admin');
        $pdf->SetTitle('Contact Form 7 Submission');
        $pdf->SetSubject('Contact Form 7 Submission');
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetHeaderMargin(0);
        // set auto page breaks
        $pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
        // set some language-dependent strings (optional)
        if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
            require_once(dirname(__FILE__).'/lang/eng.php');
            $pdf->setLanguageArray($l);
        }
        // set default font subsetting mode
        $pdf->setFontSubsetting(true);
        // add a page
        $pdf->AddPage();


        // -- set new font ---

        // convert TTF font to TCPDF format and store it on the fonts folder
        //$fontname = TCPDF_FONTS::addTTFfont('./PalanquinRegular.ttf', 'TrueTypeUnicode', '', 96);

        // use the font
        // $pdf->SetFont('Palanquin', '', 14, '', false);
        

        // -- set new background ---

        // get the current page break margin
        $bMargin = $pdf->getBreakMargin();
        // get current auto-page-break mode
        $auto_page_break = $pdf->getAutoPageBreak();
        // disable auto-page-break
        $pdf->SetAutoPageBreak(false, 0);
        // set bacground image
        $img_file = 'http://wink.ch.local/wp-content/uploads/2022/05/Gutschein_A4-scaled-1.png';
        $pdf->Image($img_file, 0, 0, 297, 210, '', '', '', false, 300, '', false, false, 0);
        // restore auto-page-break status
        $pdf->SetAutoPageBreak($auto_page_break, $bMargin);
        // set the starting point for the page content
        $pdf->setPageMark();



        $pdf->SetLeftMargin(159);
        $pdf->SetTopMargin(129);
        $pdf->SetFont('palanquin', '', 25, '', false);
        $pdf->SetFont('palanquinBold', '', 25, '', false);


        //content to print
        $html ='<div style="font-family:palanquinBold;color:#510f0a;font-size:22px;font-weight:bold;text-align:center;">Gutschein<br>'.$lektion.'<br><span style="font-family:palanquin;color:#510f0a;font-size:15px;font-weight:normal;text-align:center;"><br>für '.$name.'</span></div>';
        //$html .='<div style="font-family:Palanquin;color:#510f0a;font-size:15px;font-weight:normal;text-align:center;">für '.$name.'</div>';
        // print text
        $pdf->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);


       

        // -- set new background ---

        //$pdf->AddPage();

        /*     // get the current page break margin
            $bMargin = $pdf->getBreakMargin();
            // get current auto-page-break mode
            $auto_page_break = $pdf->getAutoPageBreak();
            // disable auto-page-break
            $pdf->SetAutoPageBreak(false, 0);
            // set bacground image
            $img_file = 'http://wink.ch.local/wp-content/uploads/2022/05/Gutschein_A4-ES.png';
            $pdf->Image($img_file, 0, 0, 297, 210, '', '', '', false, 300, '', false, false, 0);
            // restore auto-page-break status
            $pdf->SetAutoPageBreak($auto_page_break, $bMargin);
            // set the starting point for the page content
            $pdf->setPageMark(); */




        $filename =rand().'_'.time().'.pdf';
        $pdf->Output($savepath.$filename, 'F');
        return $filename;
    }
}
