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
//      DragDropPanel.java    -  edu.sdsc.grid.gui.applet.DragDropPanel
//
//  CLASS HIERARCHY
//      java.lang.Object
//          |
//          +-.JPanel
//                  |
//                  +-.DragDropPanel
//
//  PRINCIPAL AUTHOR
//      Alex Wu, SDSC/UCSD
//
//

package edu.sdsc.grid.gui.applet;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URISyntaxException;
import java.net.MalformedURLException;

import java.io.File;
import java.io.IOException;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

import java.awt.Color;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.BorderLayout;
import java.awt.dnd.DropTarget;
import java.awt.dnd.DnDConstants;
import java.awt.datatransfer.DataFlavor;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.KeyboardFocusManager;
import java.awt.KeyEventDispatcher;
import java.awt.event.KeyEvent;
import java.awt.event.FocusListener;
import java.awt.event.FocusEvent;

import javax.swing.JScrollPane;
import javax.swing.table.TableColumn;
import javax.swing.JTable;
import javax.swing.JLabel;
import javax.swing.JProgressBar;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.ListSelectionEvent;
import javax.swing.BorderFactory;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.SpringLayout;
import javax.swing.border.TitledBorder;

import com.sun.java.browser.dom.*;

import org.w3c.dom.*;
import org.w3c.dom.css.*;
import org.w3c.dom.events.*;
import org.w3c.dom.html.*;
import org.w3c.dom.stylesheets.*;
import org.w3c.dom.views.*;

import edu.sdsc.grid.io.srb.SRBException;
import edu.sdsc.grid.io.FileFactory;
import edu.sdsc.grid.io.GeneralFile;
import edu.sdsc.grid.io.local.LocalFile;

import edu.sdsc.grid.io.irods.IRODSFile;
import edu.sdsc.grid.io.irods.IRODSFileSystem;
import edu.sdsc.grid.io.irods.IRODSAccount;


class DragDropPanel extends MyPanel implements ActionListener, FocusListener {
    private DropTarget dropTarget;    
    private UploadTableModel model;
    private MyButton removeButton;
    private MyButton uploadButton;
    private MyButton clearCompletedButton;
    private MyButton cancelUploadButton;
    
    // Detail panel fields
    private MyTextField tfSource, tfDestination;
    private JLabel fileSizeLabel, userLabel, hostLabel, portLabel;
    
    private JTable table;
    private String STR_REMOVE = "REMOVE SELECTED";
    private String STR_UPLOAD = "UPLOAD";
    private String STR_CLEAR_COMPLETED = "CLEAR COMPLETED";
    private String STR_CANCEL_UPLOAD = "CANCEL UPLOAD";
    private String STR_REMOVE_TOOLTIP = "Remove selected files from the table";
    private String STR_UPLOAD_TOOLTIP = "Start upload";
    private String STR_CLEAR_COMPLETED_TOOLTIP = "Clear completed files from the table";
    private String STR_CANCEL_UPLOAD_TOOLTIP = "Cancel upload process";
    
    private Account account;
    
    public static final DataFlavor fileListFlavor = DataFlavor.javaFileListFlavor;
    public static final DataFlavor[] flavors = { fileListFlavor };
    public static final List flavorList = Arrays.asList(flavors);
    private DataFlavor chosenFlavor;
    
    private File fileLog;
    static AppletLogger logger = AppletLogger.getInstance();
    private UploadApplet applet;
    private DragDropPanel() {}
    
    /**
     * set when user clicks on Cancel button
     */
    private boolean cancelUpload = false;
    
    /**
     * tracks the last time a JavaScript call was made to refresh the browser client
     */
    private long lastUploadTime = 0;
    
    
    DragDropPanel(UploadApplet app, UploadTableModel model, Account account) {
        this.setLayout(new BorderLayout());
        tfSource = new MyTextField();
        tfDestination = new MyTextField();
        fileSizeLabel =  new JLabel("");
        userLabel = new JLabel("");
        hostLabel = new JLabel("");
        portLabel = new JLabel("");
        this.applet = app;
        this.model = model;
        this.account = account;
        init();
    }
    
    /**
     * Creates the remove and upload button.
     * Creates the drop target for file drops.
     * JTable that holds the file queue is scrollable.
     **/
    public void init() {
        table = new JTable(model);
        table.setRowHeight(20);
        table.addFocusListener(this);
        table.setPreferredScrollableViewportSize(new Dimension(600, 400));
        
        table.setDefaultRenderer (  JProgressBar.class, new ProgressBarRenderer());
        table.setDefaultRenderer (  JTextField.class, new JTextFieldRenderer());
        table.setDefaultEditor (  JTextField.class, new JTextFieldEditor());
        
        // add selection listener to table
        SelectionListener listener = new SelectionListener(table);
        table.getSelectionModel().addListSelectionListener(listener);
        table.getColumnModel().getSelectionModel().addListSelectionListener(listener);
        
        // set table column width
        TableColumn col = table.getColumnModel().getColumn(UploadTableModel.ICON_COLUMN); // icon
        col.setMaxWidth(30);
        col = table.getColumnModel().getColumn(UploadTableModel.SOURCE_COLUMN); // file name
        col.setPreferredWidth(35);
        col = table.getColumnModel().getColumn(UploadTableModel.DESTINATION_COLUMN); // file parent folder name
        col.setMinWidth(120);
        col = table.getColumnModel().getColumn(UploadTableModel.RESOURCE_COLUMN); // file parent folder name
        col.setPreferredWidth(30);
        col.setCellEditor(new JComboBoxEditor());
        col.setCellRenderer(new JComboBoxRenderer());
        col = table.getColumnModel().getColumn(UploadTableModel.STATUS_COLUMN); // progress bar
        col.setPreferredWidth(20);
        
        //Create the scroll pane and add the table to it.
        JScrollPane scrollPane = new JScrollPane(table);

        //Add the scroll pane to this panel.
        this.add(new JLabel("Drag and drop files to the table below."), BorderLayout.PAGE_START);
        this.add(scrollPane, BorderLayout.CENTER);
        
        MyPanel buttonPanel = new MyPanel(new FlowLayout());
        
        clearCompletedButton = new MyButton(STR_CLEAR_COMPLETED);
        clearCompletedButton.setActionCommand(STR_CLEAR_COMPLETED);
        clearCompletedButton.setToolTipText(STR_CLEAR_COMPLETED_TOOLTIP);
        clearCompletedButton.addActionListener(this);
        
        removeButton = new MyButton(STR_REMOVE);
        removeButton.setActionCommand(STR_REMOVE);
        removeButton.setToolTipText(STR_REMOVE_TOOLTIP);
        removeButton.addActionListener(this);
        
        uploadButton = new MyButton(STR_UPLOAD);
        uploadButton.setActionCommand(STR_UPLOAD);
        uploadButton.setToolTipText(STR_UPLOAD_TOOLTIP);
        uploadButton.addActionListener(this);

        cancelUploadButton = new MyButton(STR_CANCEL_UPLOAD);
        cancelUploadButton.setActionCommand(STR_CANCEL_UPLOAD);
        cancelUploadButton.setToolTipText(STR_CANCEL_UPLOAD_TOOLTIP);
        cancelUploadButton.addActionListener(this);
        
        // Add Buttons
        buttonPanel.add(clearCompletedButton);
        buttonPanel.add(removeButton);
        buttonPanel.add(uploadButton);
        buttonPanel.add(cancelUploadButton);
        
        // Detail of file in table row
        MyPanel detailPanel = new MyPanel(new SpringLayout());
        detailPanel.setBorder(new TitledBorder(BorderFactory.createLineBorder(Color.GRAY), "File Detail"));
        detailPanel.add(new JLabel("Source"));
        detailPanel.add(tfSource);
        detailPanel.add(new JLabel("Destination"));
        detailPanel.add(tfDestination);
        detailPanel.add(new JLabel("Size"));
        detailPanel.add(fileSizeLabel);
        detailPanel.add(new JLabel("User"));
        detailPanel.add(userLabel);
        detailPanel.add(new JLabel("Host"));
        detailPanel.add(hostLabel);
        detailPanel.add(new JLabel("Port"));
        detailPanel.add(portLabel);
        
        SpringUtilities.makeCompactGrid(detailPanel, //parent
                                        6, 2, // 3 rows, 2 columns
                                        3, 3,  //initX, initY
                                        3, 3); //xPad, yPad
        
        MyPanel buttonAndDetailPanel = new MyPanel(new BorderLayout());
        buttonAndDetailPanel.add(buttonPanel, BorderLayout.CENTER);
        buttonAndDetailPanel.add(detailPanel, BorderLayout.PAGE_END);
        
        this.add(buttonAndDetailPanel, BorderLayout.PAGE_END);

        DragDropListener dragDropListener = new DragDropListener(model, applet, account);
        dropTarget = new DropTarget(table, DnDConstants.ACTION_COPY, dragDropListener, true); 
        dropTarget = new DropTarget(this, DnDConstants.ACTION_COPY, dragDropListener, true); 
        
        // for now, consume everything except left/right arrow key
        // will probably have to change this to allow other key strokes
        KeyboardFocusManager.getCurrentKeyboardFocusManager().addKeyEventDispatcher(
            new KeyEventDispatcher(){
                public boolean dispatchKeyEvent(KeyEvent ke){
                    // consume everything except left and right arrow key
                    if (!(ke.getKeyCode() == KeyEvent.VK_LEFT) && !(ke.getKeyCode() == KeyEvent.VK_RIGHT))
                        ke.consume();

                    return false;
                }
        });
        
    }//init


    // handles button click event
    public void actionPerformed(ActionEvent e) {
        String action = e.getActionCommand().toUpperCase();
        
        if (action.equals(STR_CANCEL_UPLOAD)) {
            cancelUpload = true;
            
        } else if (action.equals(STR_CLEAR_COMPLETED)) {
            int rowCount = table.getRowCount();
            List rowList = new ArrayList();
            
            for (int row=0; row < rowCount; row++) {
                JProgressBar bar = (model.getValueAt(row, UploadTableModel.STATUS_COLUMN) == null) ? new JProgressBar(0,100) : (JProgressBar) model.getValueAt(row, UploadTableModel.STATUS_COLUMN);
                    
                if (bar.getString().equalsIgnoreCase(UploadItem.DONE_STATUS))
                    rowList.add(new Integer(row));
            }//for
            
            int[] rows = new int[rowList.size()];
            for (int i=0; i<rowList.size(); i++) {
                rows[i] = ((Integer) rowList.get(i)).intValue();
            }//for
            
            model.removeFile(rows);
            
            Runnable r = new Runnable() {
                public void run() {
                    table.removeEditor();
                }
            };
            SwingUtilities.invokeLater(r);
            
        } else if (action.equals(STR_REMOVE)) {
            int[] selectedRows = table.getSelectedRows();
            model.removeFile(selectedRows);
            
            Runnable r = new Runnable() {
                public void run() {
                    table.removeEditor();
                }
            };
            SwingUtilities.invokeLater(r);
                                       
        } else if (action.equals(STR_UPLOAD)) {
            upload();    
        }
    }//actionPerformed
    

    // calls JavaScript on the browser client
    private void callJavaScript(String function) {
        try {
            applet.getAppletContext().showDocument(new URL("javascript:" + function), "_self");
        } catch (MalformedURLException e) {
            logger.log("JavaScript URL exception: " + e);
        }
    }//callJavaScript
    
    
    // Handles the upload to the irods server
    private class UploadThread implements Runnable {
        JProgressBar progressBar = null; //new JProgressBar(0, 100);
        int row;
        
        public UploadThread(int row) {
            this.row = row;
        }
        Runnable updateUI = new Runnable() {
            public void run() {
                table.updateUI();
            }
        };
        
        boolean uploadSuccess = false;
        
        public void run() {
            long startUploadTime = System.currentTimeMillis();
            
            // USE table events as a replacement, but this will do for now
            //
            // column may have been rearranged in the table, get column index for 
            // source, destination, and progress bar
            // Rearranging columns in the table will not rearrange the column order in the model
            int statusColumn = UploadTableModel.STATUS_COLUMN;
            int sourceColumn = UploadTableModel.SOURCE_COLUMN;
            int destinationColumn = UploadTableModel.DESTINATION_COLUMN;

            int columnCount = table.getColumnCount();
            for (int k = 0; k < columnCount; k++) {
                String columnName = table.getColumnName(k);

                if (columnName.equals("Status")) {
                    statusColumn = k;
                    break;
                }
            }//for


            JTextField tf = (JTextField) model.getValueAt(row, UploadTableModel.SOURCE_COLUMN);
            String sourcePath = tf.getText();

            tf = (JTextField) model.getValueAt(row, UploadTableModel.DESTINATION_COLUMN);
            String destinationUri = tf.getText();

            JComboBox comboBox = (JComboBox) model.getValueAt(row, UploadTableModel.RESOURCE_COLUMN);
            String resource = (String) comboBox.getSelectedItem();

            /*
            // quick fix for now
            if (destinationUri.indexOf("irods://") == -1) {
                StringBuffer buf = new StringBuffer(destinationUri);
                buf.insert(0, "irods://");
                destinationUri = buf.toString();
            }
             */
            UploadItem uploadItem;
            GeneralFile sourceFile = null, destinationFile = null;

            try {
              //sourcePath always local?             
              sourceFile= new LocalFile( new URI(sourcePath) );
            // TRY if password == null, set progress bar to failed
            String password = null;
            try {
              //TODO change char[]
              password = account.getPassword( new URI(destinationUri) ); 
            } catch( java.net.URISyntaxException e ) {
              throw new RuntimeException("URISyntaxException failure");
            }             
            
              destinationFile = 
                FileFactory.newFile(new java.net.URI( destinationUri ), password);
              uploadItem = new UploadItem(sourceFile, destinationFile, resource);
            } catch( java.io.IOException e ) {
              throw new RuntimeException("IOException failure");
            } catch( java.net.URISyntaxException e ) {
              throw new RuntimeException("URISyntaxException failure");
            }       

            // may be null if user has not authenticated to rods server
            // can happen if trying to upload a recovered queue from previous session
            //
            // sample scenario:
            // 1. User logs in to
            //    http://client64-100.sdsc.edu/web/browse.php#ruri=rods@client64-100.sdsc.edu%3A1247/tempZone/home/rods
            //
            //    2. User launches applet and drag-drops a file
            //
            //    3. Without uploading the file, user ends browser session by closing or clearing cache.
            //
            //    4. User logs in to
            //    http://client64-100.sdsc.edu/web/browse.php#ruri=rods@saltwater.sdsc.edu%3A1247/tempZone/home/rods
            //
            //    5. User launches applet and file from previous session is recovered
            //
            //    6. User attempts upload by clicking UPLOAD button
            //
            //    7. FAILED because user has not authenticated to client64-100.sdsc.edu
            //

            
            try {
                progressBar = new JProgressBar(0, 100);
                table.setValueAt(progressBar, row, statusColumn);


                if (OptionsPanel.OVERWRITE_FORCED || !destinationFile.exists())
                {
                    progressBar.setIndeterminate(false);
                    progressBar.setValue(0);
                    progressBar.setStringPainted(true);
                    progressBar.setString(UploadItem.IN_PROGRESS_STATUS);
                    SwingUtilities.invokeLater(updateUI);

                    sourceFile.copyTo(destinationFile, OptionsPanel.OVERWRITE_FORCED);

                    progressBar.setIndeterminate(false);
                    progressBar.setValue(100);
                    progressBar.setString(UploadItem.DONE_STATUS);
                    uploadSuccess = true;
                } else if (sourceFile.isDirectory()) {
                    // give user options to define upload behavior for folders
                    // 1. checksum -timeconsuming
                    // 2. directory file count
                    // 3. file names in directory

                    // for now, forced overwrite
                    sourceFile.copyTo(destinationFile, true);

                } else if (OptionsPanel.OVERWRITE_IF_CHECKSUM) {

                    // file only
                    // compare checksum between remote and local file; overwrite if checksum differs
                    String sourceChecksum = sourceFile.checksum();
                    String destinationChecksum = destinationFile.checksum(); // null pointer exception and file is not a directory

                    if (! sourceChecksum.equals(destinationChecksum)) {
                        sourceFile.copyTo(destinationFile, true);
                    }

                } else if (OptionsPanel.OVERWRITE_IF_FILE_SIZE) {

                    // file only
                    // compare file size between remote and local file; overwrite if file size differs
                    long sourceSize = sourceFile.length();
                    long destinationSize = destinationFile.length();

                    if (sourceSize != destinationSize) {
                        sourceFile.copyTo(destinationFile, true);
                    }
                }

                // update DB
                DBUtil.getInstance().updateStatus(uploadItem, UploadItem.STATUS_UPLOADED);

            } catch (SRBException srbE) {
                logger.log("srb exc. " + srbE);
                //srbE.printStackTrace();

                progressBar.setIndeterminate(false);
                progressBar.setStringPainted(true);
                progressBar.setString(UploadItem.FAILED_STATUS);
            } catch (IOException ioe) {
                logger.log("io exc. " + ioe);
                ioe.printStackTrace();

                progressBar.setIndeterminate(false);
                progressBar.setStringPainted(true);
                progressBar.setString(UploadItem.FAILED_STATUS);
            } catch (Exception e) {
                //such as null pointer because source or destination was null
                logger.log("Uploading Exc. " + e);
                e.printStackTrace();

                progressBar.setIndeterminate(false);
                progressBar.setStringPainted(true);
                progressBar.setString(UploadItem.FAILED_STATUS);
            }finally {             
                SwingUtilities.invokeLater(updateUI);

                if (uploadSuccess)
                    dimTableRow(row); // dim the row that just completed

/*TODO should I do something like this?
                try {
                    if (irodsFs.isConnected()) {
                        irodsFs.close();
                    }
                } catch (IOException e) {
                    logger.log("Problem closing irods filesystem connection. " + e);
                }//try-catch
*/

                // refresh on upload complete if more than 15 seconds from last refresh
                //
                if (System.currentTimeMillis() - lastUploadTime > 15000) {
                    // if uploaded destination uri is same as current uri
                    // then call JavaScript to reload grid page
                    if ( uploadItem.getDestinationParent().getPath().equals(
                      applet.getRuri().getPath()) ) 
                    {
                      callJavaScript("refreshGrid()");
                    }
                    
                    // refresh folder view
                    if (uploadItem.getType().equals(UploadItem.TYPE_FOLDER)) {
                        String s = "refreshTreeNodeByRURI('" + account.getURI() + "')";
                        callJavaScript(s);
                    }//if
                }//if
            }//try-catch-finally
        }
    }//UploadThread
    
    
    private void upload() {
        new Thread() {
            public void run() {
                cancelUpload = false; // reset
                int rowCount = model.getRowCount();
                URI remoteURI = null;

                clearCompletedButton.setEnabled(false);
                uploadButton.setEnabled(false);
                removeButton.setEnabled(false);

                try {
                    for (int row = 0; row < rowCount; row++) {
                        // first check if file has been uploaded successfully
                        // 1. check for ProgressBar
                        // 2. check string of ProgressBar
                        // 3. if DONE, don't upload again
                        // 4. else, upload
                        //
                        // TODO: check against Database instead
                        //
                        JProgressBar bar = (model.getValueAt(row, UploadTableModel.STATUS_COLUMN) == null) ? new JProgressBar(0,100) : (JProgressBar) model.getValueAt(row, UploadTableModel.STATUS_COLUMN);

                        if (bar.getString().equalsIgnoreCase(UploadItem.DONE_STATUS))
                            continue; // file already uploaded successfully, skip and continue to next file

                        if (System.currentTimeMillis() - lastUploadTime > 15000)
                            lastUploadTime = System.currentTimeMillis();
                        
                        if (row+1 == rowCount) // last row, make sure refresh happens
                            lastUploadTime = 0;
                        
                        Thread uploadThread = new Thread(new UploadThread(row));
                        uploadThread.setPriority(Thread.MIN_PRIORITY);
                        uploadThread.start();
                        uploadThread.join(15000); // wait 15 seconds for this thread to finish
                        
                        while (uploadThread.isAlive()) {
                            // check to see if user has clicked on button
                            // to cancel upload process
                            if (uploadThread.isAlive() && cancelUpload == true) {
                                uploadThread.interrupt();
                                uploadThread.join(); // wait until current upload finishes
                            } else
                                uploadThread.join(15000); // wait another 15 seconds for this thread to finish
                            
                        }//while   

                        // user clicked on button to cancel upload
                        // stop upload process
                        if (cancelUpload == true)
                            break;
                        
                        Thread.yield(); // be nice

                    }//for

                } catch (Exception e) {
                    logger.log("Upload for loop exeception. " + e);

                } finally {
                    clearCompletedButton.setEnabled(true);
                    uploadButton.setEnabled(true);
                    removeButton.setEnabled(true);
                }//try-catch-finally
            }//run
        }.start();
        
    }//upload    
    

    // changes the color of items for the row to indicate upload is complete
    // also disables the items for the row
    private void dimTableRow(int row) {
        JComponent c = (JComponent) table.getValueAt(row, UploadTableModel.SOURCE_COLUMN);
        c.setForeground(Color.GRAY);
        c.setEnabled(false);
        
        c = (JComponent) table.getValueAt(row, UploadTableModel.DESTINATION_COLUMN);
        c.setForeground(Color.GRAY);
        c.setEnabled(false);
        
        c = (JComponent) table.getValueAt(row, UploadTableModel.RESOURCE_COLUMN);
        c.setForeground(Color.GRAY);
        c.setEnabled(false);
        
        c = (JComponent) table.getValueAt(row, UploadTableModel.STATUS_COLUMN);
        c.setForeground(Color.GRAY);
    }
 
    
    public void focusGained(FocusEvent e) {
    }

    public void focusLost(FocusEvent e) {
    }

    // sets the background color of components in the selected row
    // also, sets the values for the detail panel when one row is selected
    class SelectionListener implements ListSelectionListener {
        JTable table;

        // It is necessary to keep the table since it is not possible
        // to determine the table from the event's source
        SelectionListener(JTable table) {
            this.table = table;
            this.table.setSelectionBackground(new MyColor());
        }
        public void valueChanged(ListSelectionEvent e) {

            // If cell selection is enabled, both row and column change events are fired
            if (e.getSource() == table.getSelectionModel() && table.getRowSelectionAllowed()) {

                // first clear all background
                for (int i=0; i < table.getRowCount(); i++) {
                    // change background color
                    JTextField tf = (JTextField) table.getValueAt(i, UploadTableModel.SOURCE_COLUMN);
                    tf.setBackground(Color.WHITE);

                    tf = (JTextField) table.getValueAt(i, UploadTableModel.DESTINATION_COLUMN);
                    tf.setBackground(Color.WHITE);
                }//for


                int[] rows = table.getSelectedRows();
                for (int i=0; i < rows.length; i++) {
                    // change background color
                    JTextField tf = (JTextField) table.getValueAt(rows[i], UploadTableModel.SOURCE_COLUMN);
                    tf.setBackground(new MyColor());

                    tf = (JTextField) table.getValueAt(rows[i], UploadTableModel.DESTINATION_COLUMN);
                    tf.setBackground(new MyColor());
                }//for

                // display detail of row selected, ONLY if one row selected
                if (rows.length == 1) {

                    tfSource.setText(((JTextField) table.getValueAt(rows[0], UploadTableModel.SOURCE_COLUMN)).getText());

                    String destinationText = ((JTextField) table.getValueAt(rows[0], UploadTableModel.DESTINATION_COLUMN)).getText();
                    tfDestination.setText(destinationText);

                    // TODO: find a better way
                    File f = new File(tfSource.getText());
                    if (f.isFile()) {
                        fileSizeLabel.setText(f.length() + " bytes");
                    } else {
                        fileSizeLabel.setText("");
                    }//if-else

                    try {
                        URI uri = new URI(destinationText);
                        userLabel.setText(uri.getUserInfo());
                        hostLabel.setText(uri.getHost());
                        portLabel.setText("" + uri.getPort());
                    } catch (URISyntaxException ex) {
                        ex.printStackTrace();
                    }
                } else {
                    tfSource.setText("");
                    tfDestination.setText("");
                    fileSizeLabel.setText("");
                    userLabel.setText("");
                    hostLabel.setText("");
                    portLabel.setText("");
                }

            }//if 

            if (e.getValueIsAdjusting()) {
                // The mouse button has not yet been released
            }
        }//valueChanged

    }//SelectionListener    
}//DragDropPanel








