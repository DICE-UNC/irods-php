//      Copyright (c) 2005, Regents of the University of California
//      All rights reserved.
//
//      Redistribution and use in source and binary forms, with or without
//      modification, are permitted provided that the following conditions are
//      met:
//
//        * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//        * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//        * Neither the name of the University of California, San Diego (UCSD) nor
//      the names of its contributors may be used to endorse or promote products
//      derived from this software without specific prior written permission.
//
//      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
//      IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
//      THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
//      PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
//      CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
//      EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
//      PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
//      PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//      LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//      NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
//      SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//
//  FILE
//      OptionsPanel.java    -  edu.sdsc.grid.gui.applet.OptionsPanel
//
//  CLASS HIERARCHY
//      java.lang.Object
//          |
//          +-.JPanel
//                   |
//                   +-.OptionsPanel
//
//  PRINCIPAL AUTHOR
//      Alex Wu, SDSC/UCSD
//
//

package edu.sdsc.grid.gui.applet;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;

import javax.swing.JLabel;
import javax.swing.JCheckBox;
import javax.swing.JRadioButton;
import javax.swing.ButtonGroup;


class OptionsPanel extends MyPanel implements ActionListener {
    private MyRadioButton overwriteRadio;
    private MyRadioButton checksumRadio;
    private MyRadioButton fileSizeRadio;
    private JCheckBox checksumCheckBox;

    /* Upload options set by user */
    public static boolean OVERWRITE_FORCED = true; // upload overwrites remote file; default behavior
    public static boolean OVERWRITE_IF_CHECKSUM; // overwrite if checksum is different
    public static boolean OVERWRITE_IF_FILE_SIZE; // overwrite if file size is different
    public static boolean VERIFY_UPLOAD_WITH_CHECKSUM; // verify upload with checksum comparison; default behavior

    private String STR_VERIFY_UPLOAD_WITH_CHECKSUM = "VERIFY_UPLOAD_WITH_CHECKSUM";
    private String STR_RADIO_GROUP = "RADIO_GROUP";


    OptionsPanel() {
        init();
    }

    public void init() {
        // options panel
        MyPanel p = new MyPanel();

        p.add(new JLabel("Overwrite Options"));
        this.add(p);

        overwriteRadio = new MyRadioButton("Forced overwrite", OVERWRITE_FORCED);
        checksumRadio = new MyRadioButton("Compare checksum", OVERWRITE_IF_CHECKSUM);
        fileSizeRadio = new MyRadioButton("Compare file size", OVERWRITE_IF_FILE_SIZE);

        // disable checksum and file size radio button for now
        checksumRadio.setEnabled(false);
        fileSizeRadio.setEnabled(false);


        overwriteRadio.setActionCommand(STR_RADIO_GROUP);
        checksumRadio.setActionCommand(STR_RADIO_GROUP);
        fileSizeRadio.setActionCommand(STR_RADIO_GROUP);

        overwriteRadio.addActionListener(this);
        checksumRadio.addActionListener(this);
        fileSizeRadio.addActionListener(this);

        ButtonGroup fileButtonGroup = new ButtonGroup();
        fileButtonGroup.add(overwriteRadio);
        fileButtonGroup.add(checksumRadio);
        fileButtonGroup.add(fileSizeRadio);

        p = new MyPanel();
        p.add(overwriteRadio);
        p.add(checksumRadio);
        p.add(fileSizeRadio);
        this.add(p);


        // Dir overwrite option selection
        /*
        ButtonGroup dirButtonGroup = new ButtonGroup();
        JRadioButton dirOverwriteRadio = new JRadioButton("Forced overwrite", OVERWRITE_FORCED);
        dirButtonGroup.add(dirOverwriteRadio);
        */
        /*
        p = new JPanel();
        p.add(new JLabel("Directory Overwrite Options"));
        p.add(dirOverwriteRadio);
        this.add(p);
        */
        /*
        p = new JPanel();
        checksumCheckBox = new JCheckBox("Verify upload with checksum");
        checksumCheckBox.setActionCommand(STR_VERIFY_UPLOAD_WITH_CHECKSUM);
        checksumCheckBox.addActionListener(this);
        p.add(checksumCheckBox);

        optionPanel.add(p);
        */
    }//init

    private void updateUploadOption(Object obj) {
        if (obj.getClass() != new JRadioButton().getClass())
            return;

        OVERWRITE_FORCED = overwriteRadio.isSelected();
        OVERWRITE_IF_CHECKSUM = checksumRadio.isSelected();
        OVERWRITE_IF_FILE_SIZE = fileSizeRadio.isSelected();
    }

    public void actionPerformed(ActionEvent e) {
        updateUploadOption(e.getSource());
    }
}
